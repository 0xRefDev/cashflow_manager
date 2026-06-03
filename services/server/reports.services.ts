"server-only";

import Movements from "@/models/Movements";

import { Types } from "mongoose";

export async function getPeriodSummary(
  userId: string,
  period: "week" | "month" | "quarter" | "year" | "all" = "all",
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
    case "all":
      startDate = new Date(0);
      break;
  }

  const userObjectId = new Types.ObjectId(userId);

  const [incomeResult, expenseResult] = await Promise.all([
    Movements.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "income",
          date: { $gte: startDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]),
    Movements.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "expense",
          date: { $gte: startDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]),
  ]);

  const income = incomeResult[0]?.total || 0;
  const expense = expenseResult[0]?.total || 0;
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
  };
}

export async function getLiveReport(
  userId: string,
  page: number = 1,
  limit: number = 5,
) {
  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    Movements.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "walletId",
        populate: {
          path: "currencyId",
        },
      })
      .populate("category")
      .lean(),
    Movements.countDocuments({ userId }),
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
