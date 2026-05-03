"server-only";

import Wallet from "@/models/Wallets";
import Movements from "@/models/Movements";

export async function getFinancialSummary(userId: string) {
  const wallets = await Wallet.find({ userId }).populate("currencyId");
  
  const totalSavings = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

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
    .populate("walletId")
    .lean();

  const data = movements.map(m => ({
    date: (m.date as Date).toISOString(),
    quantity: m.quantity,
    type: m.type,
    currency: (m.walletId as any)?.currencyId || null
  }));

  return { period, data };
}

export async function getWalletDistribution(userId: string) {
  const wallets = await Wallet.find({ userId }).populate("currencyId");

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  const distribution = wallets.map(w => ({
    walletId: w._id,
    name: w.name,
    balance: w.balance,
    percentage: totalBalance > 0 ? Math.round((w.balance / totalBalance) * 10000) / 100 : 0,
    currency: (w.currencyId as any)?.code || null
  }));

  return distribution;
}