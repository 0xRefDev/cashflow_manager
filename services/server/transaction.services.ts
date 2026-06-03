import "server-only";
import mongoose from "mongoose";
import { NewTransaction } from "@/types/transaction.types";
import Movements from "@/models/Movements";
import Wallet from "@/models/Wallets";
import { assertObjectId } from "@/lib/api";

async function addTransactionAtomic(transactionData: NewTransaction) {
  const session = await mongoose.startSession();
  try {
    let transaction: (typeof Movements.prototype) | null = null;
    await session.withTransaction(async () => {
      const { quantity, userId, walletId, type } = transactionData;
      const updateResult = await Wallet.updateOne(
        {
          _id: walletId,
          userId,
          ...(type === "expense" ? { balance: { $gte: quantity } } : {}),
        },
        { $inc: { balance: type === "income" ? quantity : -quantity } },
        { session }
      );
      if (updateResult.matchedCount === 0) {
        throw new Error("Wallet not found, unauthorized, or insufficient balance");
      }
      const [created] = await Movements.create([transactionData], { session });
      transaction = created;
    });
    return transaction!;
  } finally {
    await session.endSession();
  }
}

async function addTransactionWithRollback(transactionData: NewTransaction) {
  const { quantity, userId, walletId, type } = transactionData;

  const updateResult = await Wallet.updateOne(
    {
      _id: walletId,
      userId,
      ...(type === "expense" ? { balance: { $gte: quantity } } : {}),
    },
    { $inc: { balance: type === "income" ? quantity : -quantity } }
  );

  if (updateResult.matchedCount === 0) {
    throw new Error("Wallet not found, unauthorized, or insufficient balance");
  }

  try {
    return await Movements.create(transactionData);
  } catch (err) {
    await Wallet.updateOne(
      { _id: walletId, userId },
      { $inc: { balance: type === "income" ? -quantity : quantity } }
    );
    throw err;
  }
}

function isReplicaSetError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("transaction numbers on a standalone") ||
    msg.includes("replica set") ||
    msg.includes("not support sessions") ||
    ("code" in err && (err as NodeJS.ErrnoException).code === "20")
  );
}

export async function addTransaction(transactionData: NewTransaction) {
  assertObjectId(transactionData.walletId, "walletId");
  assertObjectId(transactionData.userId, "userId");

  try {
    return await addTransactionAtomic(transactionData);
  } catch (err) {
    if (isReplicaSetError(err)) {
      return await addTransactionWithRollback(transactionData);
    }
    throw err;
  }
}

async function deleteTransactionAtomic(transactionId: string, userId: string) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const movement = await Movements.findOne({ _id: transactionId, userId }).session(session);
      if (!movement) throw new Error("Movement not found or unauthorized");
      await Wallet.updateOne(
        { _id: movement.walletId, userId },
        { $inc: { balance: movement.type === "income" ? -movement.quantity : movement.quantity } },
        { session }
      );
      await Movements.findByIdAndDelete(transactionId, { session });
    });
  } finally {
    await session.endSession();
  }
}

async function deleteTransactionWithRollback(transactionId: string, userId: string) {
  const movement = await Movements.findOne({ _id: transactionId, userId });
  if (!movement) throw new Error("Movement not found or unauthorized");

  await Wallet.updateOne(
    { _id: movement.walletId, userId },
    { $inc: { balance: movement.type === "income" ? -movement.quantity : movement.quantity } }
  );

  try {
    await Movements.findByIdAndDelete(transactionId);
  } catch (err) {
    await Wallet.updateOne(
      { _id: movement.walletId, userId },
      { $inc: { balance: movement.type === "income" ? movement.quantity : -movement.quantity } }
    );
    throw err;
  }
}

export async function deleteTransaction(transactionId: string, userId: string) {
  assertObjectId(transactionId, "transactionId");

  try {
    await deleteTransactionAtomic(transactionId, userId);
  } catch (err) {
    if (isReplicaSetError(err)) {
      await deleteTransactionWithRollback(transactionId, userId);
    } else {
      throw err;
    }
  }

  return { success: true };
}


export async function getUserTransactions(userId: string, queryParams: URLSearchParams) {
  try {
    if (!userId) throw new Error("User ID is missing");

    const page = Math.max(1, parseInt(queryParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(queryParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const filters: any = { userId };

    if (queryParams.get("walletId")) filters.walletId = queryParams.get("walletId");
    if (queryParams.get("type")) filters.type = queryParams.get("type");

    const from = queryParams.get("from");
    const to = queryParams.get("to");
    const period = queryParams.get("period");

    // from/to tienen prioridad sobre period
    if (from || to) {
      filters.date = {};
      if (from) filters.date.$gte = new Date(from);
      if (to) filters.date.$lte = new Date(to);
    } else if (period) {
      const now = new Date();
      const startDate = new Date();

      if (period === "week") startDate.setDate(now.getDate() - 7);
      else if (period === "month") startDate.setMonth(now.getMonth() - 1);
      else if (period === "quarter") startDate.setMonth(now.getMonth() - 3);
      else if (period === "year") startDate.setFullYear(now.getFullYear() - 1);

      filters.date = { $gte: startDate };
    }

    const [transactions, total] = await Promise.all([
      Movements.find(filters)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'walletId',
          select: 'name description currencyId',
          populate: { path: 'currencyId', select: 'name symbol' }
        })
        .lean(),
      Movements.countDocuments(filters)
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

export async function getTransactionById(id: string, userId: string) {
  try {
    if (!id || !userId) throw new Error("Invalid request");

    const transaction = await Movements.findOne({ _id: id, userId })
      .populate({
        path: 'walletId',
        select: 'name description currencyId',
        populate: { path: 'currencyId', select: 'name symbol' }
      })
      .lean();

    return transaction;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}