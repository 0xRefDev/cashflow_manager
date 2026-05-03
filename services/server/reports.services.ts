"server-only";

import Movements from "@/models/Movements";

export async function getPeriodSummary(
  userId: string,
  period: "week" | "month" | "quarter" | "year"
) {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  const [incomeResult, expenseResult] = await Promise.all([
    Movements.aggregate([
      { $match: { userId, type: "income", date: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]),
    Movements.aggregate([
      { $match: { userId, type: "expense", date: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ])
  ]);

  const income = incomeResult[0]?.total || 0;
  const expense = expenseResult[0]?.total || 0;
  const total = income + expense;

  return {
    income: {
      quantity: income,
      percentage: total > 0 ? Math.round((income / total) * 10000) / 100 : 0
    },
    expenses: {
      quantity: expense,
      percentage: total > 0 ? Math.round((expense / total) * 10000) / 100 : 0
    },
    net_balance: income - expense
  };
}

export async function getLiveReport(userId: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    Movements.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("walletId")
      .populate("category")
      .lean(),
    Movements.countDocuments({ userId })
  ]);

  const data = movements.map(m => ({
    date: (m.date as Date).toISOString(),
    description: m.description,
    movement_type: m.type,
    category: m.category,
    currency: (m.walletId as any)?.currencyId,
    amount: m.quantity
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}