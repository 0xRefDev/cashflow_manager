"server-only";

import Movements from "@/models/Movements";
import Wallet from "@/models/Wallets";
import { getExchangeRates, convertAmount } from "@/services/server/exchangeRates.services";

import { Types } from "mongoose";

export type ReportPeriod = "week" | "month" | "quarter" | "year" | "all";

export interface MovementFilters {
  period?: ReportPeriod;
  type?: "income" | "expense";
  currencyId?: string;
  search?: string;
  from?: string;
  to?: string;
}

const VALID_PERIODS: ReportPeriod[] = [
  "week",
  "month",
  "quarter",
  "year",
  "all",
];

/**
 * Parses raw query params into a validated MovementFilters object.
 * Unknown/empty values are dropped so a bare request behaves like "all".
 */
export function parseMovementFilters(
  searchParams: URLSearchParams,
): MovementFilters {
  const filters: MovementFilters = {};

  const period = searchParams.get("period");
  if (period && VALID_PERIODS.includes(period as ReportPeriod)) {
    filters.period = period as ReportPeriod;
  }

  const type = searchParams.get("type");
  if (type === "income" || type === "expense") {
    filters.type = type;
  }

  const currencyId = searchParams.get("currencyId");
  if (currencyId) filters.currencyId = currencyId;

  const search = searchParams.get("search");
  if (search && search.trim()) filters.search = search.trim();

  const from = searchParams.get("from");
  if (from) filters.from = from;

  const to = searchParams.get("to");
  if (to) filters.to = to;

  return filters;
}

/**
 * Rolling-window start date for a given period.
 * Returns null for "all" (no lower bound).
 */
function getPeriodStartDate(period: ReportPeriod): Date | null {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "quarter":
      start.setMonth(now.getMonth() - 3);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
    case "all":
    default:
      return null;
  }

  return start;
}

/**
 * Builds the Mongo query shared by the live table and the summary cards.
 * - from/to (explicit dates) take priority over the rolling period window.
 * - currency is resolved through the user's wallets (Movement → walletId → currencyId).
 * - search matches title, category, or an exact amount.
 */
async function buildMovementFilter(
  userId: string,
  filters: MovementFilters,
): Promise<Record<string, any>> {
  const { period = "all", type, currencyId, search, from, to } = filters;

  const query: Record<string, any> = { userId: new Types.ObjectId(userId) };

  if (type === "income" || type === "expense") {
    query.type = type;
  }

  // Date: explicit range wins over the period window.
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  } else {
    const start = getPeriodStartDate(period);
    if (start) query.date = { $gte: start };
  }

  // Currency: resolve the user's wallets holding that currency.
  if (currencyId) {
    const wallets = await Wallet.find({ userId, currencyId })
      .select("_id")
      .lean();
    query.walletId = { $in: wallets.map((w) => w._id) };
  }

  // Search: title / category / exact amount.
  if (search && search.trim()) {
    const term = search.trim();
    const or: Record<string, any>[] = [
      { title: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
    ];
    const amount = Number(term);
    if (!Number.isNaN(amount)) or.push({ quantity: amount });
    query.$or = or;
  }

  return query;
}

export async function getPeriodSummary(
  userId: string,
  filters: MovementFilters = {},
  baseCurrency: string = "USD",
) {
  const baseFilter = await buildMovementFilter(userId, filters);
  const { type } = filters;

  const ratesDoc = await getExchangeRates();
  const rates = ratesDoc?.rates ?? null;

  const runTotal = async (movementType: "income" | "expense") => {
    // Respect an active type filter: the other card is 0.
    if (type && type !== movementType) return 0;

    const movements = await Movements.find({ ...baseFilter, type: movementType })
      .populate({ path: "walletId", populate: { path: "currencyId" } })
      .lean();

    return movements.reduce((sum, m) => {
      const code = (m.walletId as any)?.currencyId?.name ?? baseCurrency;
      const converted = rates
        ? convertAmount(m.quantity, code, baseCurrency, rates)
        : m.quantity;
      return sum + converted;
    }, 0);
  };

  const [income, expense] = await Promise.all([
    runTotal("income"),
    runTotal("expense"),
  ]);

  const totalAmount = income + expense;

  return {
    income: {
      quantity: income,
      percentage:
        totalAmount > 0 ? Math.round((income / totalAmount) * 10000) / 100 : 0,
    },
    expenses: {
      quantity: expense,
      percentage:
        totalAmount > 0 ? Math.round((expense / totalAmount) * 10000) / 100 : 0,
    },
    net_balance: income - expense,
    baseCurrency,
  };
}

export async function getLiveReport(
  userId: string,
  page: number = 1,
  limit: number = 5,
  filters: MovementFilters = {},
) {
  const skip = (page - 1) * limit;
  const query = await buildMovementFilter(userId, filters);

  const [movements, total] = await Promise.all([
    Movements.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "walletId",
        populate: {
          path: "currencyId",
        },
      })
      .lean(),
    Movements.countDocuments(query),
  ]);

  const data = movements.map((m) => ({
    _id: m._id,
    title: m.title,
    date: (m.date as Date).toISOString(),
    description: m.description,
    type: m.type,
    quantity: m.quantity,
    category: m.category,
    walletId: {
      name: (m.walletId as any)?.name,
      currencyId: (m.walletId as any)?.currencyId,
    },
    userId: m.userId,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
