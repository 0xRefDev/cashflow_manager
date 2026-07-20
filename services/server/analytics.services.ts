"server-only";

import Wallet from "@/models/Wallets";
import Movements from "@/models/Movements";
import Preferences from "@/models/Preferences";
import Currencies from "@/models/Currencies";
import { getExchangeRates, convertAmount } from "@/services/server/exchangeRates.services";

export async function getFinancialSummary(userId: string) {
  const wallets = await Wallet.find({ userId }).populate("currencyId");

  const prefs = await Preferences.findOne({ userId }).lean<{ baseCurrency?: string } | null>();
  const baseCurrency = prefs?.baseCurrency ?? "USD";
  const rates = (await getExchangeRates())?.rates ?? {};

  const totalSavings = wallets.reduce((sum, w) => {
    const code = (w.currencyId as { name?: string } | null)?.name ?? baseCurrency;
    return sum + convertAmount(w.balance || 0, code, baseCurrency, rates);
  }, 0);

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  const [yearlyIncome, yearlyExpense] = await Promise.all([
    Movements.aggregate([
      { $match: { userId, type: "income", date: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]),
    Movements.aggregate([
      { $match: { userId, type: "expense", date: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ])
  ]);

  const [monthlyIncome, monthlyExpense] = await Promise.all([
    Movements.aggregate([
      { $match: { userId, type: "income", date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]),
    Movements.aggregate([
      { $match: { userId, type: "expense", date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ])
  ]);

  const [dailyIncome, dailyExpense] = await Promise.all([
    Movements.aggregate([
      { $match: { userId, type: "income", date: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]),
    Movements.aggregate([
      { $match: { userId, type: "expense", date: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ])
  ]);

  const incomeYear = yearlyIncome[0]?.total || 0;
  const expenseYear = yearlyExpense[0]?.total || 0;
  const growthAnnual = expenseYear > 0 ? ((incomeYear - expenseYear) / expenseYear) * 100 : 0;

  const incomeMonth = monthlyIncome[0]?.total || 0;
  const expenseMonth = monthlyExpense[0]?.total || 0;
  const growthMonthly = expenseMonth > 0 ? ((incomeMonth - expenseMonth) / expenseMonth) * 100 : 0;

  const incomeDay = dailyIncome[0]?.total || 0;
  const expenseDay = dailyExpense[0]?.total || 0;
  const growthDaily = expenseDay > 0 ? ((incomeDay - expenseDay) / expenseDay) * 100 : 0;

  return {
    total_savings: totalSavings,
    growth_annual: Math.round(growthAnnual * 100) / 100,
    growth_monthly: Math.round(growthMonthly * 100) / 100,
    growth_daily: Math.round(growthDaily * 100) / 100
  };
}

export async function getChartData(userId: string, period: "30d" | "6m" | "1y" = "30d") {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "6m":
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  const movements = await Movements.find({
    userId,
    date: { $gte: startDate }
  })
    .sort({ date: 1 })
    .populate({
      path: "walletId",
      populate: { path: "currencyId" }
    })
    .lean();

  type PopulatedMovement = {
    date: Date;
    quantity: number;
    type: "income" | "expense";
    walletId?: {
      currencyId?: { name?: string; symbol?: string } | null;
    } | null;
  };

  const typedMovements = movements as unknown as PopulatedMovement[];

  const preferences = await Preferences.findOne({ userId }).lean<{
    baseCurrency?: string;
  } | null>();
  const baseCurrency = preferences?.baseCurrency ?? "USD";

  const rates = (await getExchangeRates())?.rates ?? {};

  const baseCurrencyDoc = await Currencies.findOne({ name: baseCurrency }).lean<{
    symbol?: string;
  } | null>();
  const baseSymbol = baseCurrencyDoc?.symbol ?? "$";

  const dailyNet = new Map<string, number>();
  for (const m of typedMovements) {
    const dayKey = (m.date as Date).toISOString().slice(0, 10);
    const sign = m.type === "income" ? 1 : -1;
    const fromCode = m.walletId?.currencyId?.name ?? baseCurrency;
    const converted = convertAmount(m.quantity * sign, fromCode, baseCurrency, rates);
    dailyNet.set(dayKey, (dailyNet.get(dayKey) ?? 0) + converted);
  }

  const dayKeys = Array.from(dailyNet.keys()).sort();
  let running = 0;
  const data = dayKeys.map((dayKey) => {
    const net = dailyNet.get(dayKey) ?? 0;
    running += net;
    return {
      date: new Date(`${dayKey}T00:00:00`).toISOString(),
      amount: Math.round(running * 100) / 100,
      type: (net >= 0 ? "income" : "expense") as "income" | "expense",
      currency: baseSymbol,
      percentage: "%",
      growth: running >= 0,
    };
  });

  return { period, data };
}

export async function getWalletDistribution(userId: string) {
  const wallets = await Wallet.find({ userId }).populate("currencyId");

  type PopulatedWallet = {
    _id: string;
    name: string;
    balance: number;
    currencyId?: { symbol?: string } | null;
  };

  const typedWallets = wallets as unknown as PopulatedWallet[];

  const totalBalance = typedWallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  const distribution = typedWallets.map((w) => ({
    walletId: w._id,
    name: w.name,
    balance: w.balance,
    percentage: totalBalance > 0 ? Math.round((w.balance / totalBalance) * 10000) / 100 : 0,
    currency: w.currencyId?.symbol ?? null
  }));

  return distribution;
}