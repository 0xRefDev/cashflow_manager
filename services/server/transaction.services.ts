import "server-only";
import mongoose from "mongoose";
import { NewTransaction, UpdateTransactionData } from "@/types/transaction.types";
import Movements from "@/models/Movements";
import Wallet from "@/models/Wallets";
import { assertObjectId } from "@/lib/api";

let supportsTransactions: boolean | null = null;

async function canUseTransactions() {
  if (supportsTransactions !== null) {
    return supportsTransactions;
  }

  try {
    const admin = mongoose.connection.db?.admin();

    if (!admin) {
      supportsTransactions = false;
      return false;
    }

    const hello = await admin.command({ hello: 1 });

    supportsTransactions = Boolean(hello.setName);
  } catch {
    supportsTransactions = false;
  }

  return supportsTransactions;
}

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

  const errCode = (err as NodeJS.ErrnoException).code;

  return (
    msg.includes("replica set") ||
    msg.includes("standalone") ||
    msg.includes("transaction numbers") ||
    msg.includes("not support sessions") ||
    msg.includes("retryable writes") ||
    msg.includes("not support retryable writes") ||
    msg.includes("not running with --replset") ||
    msg.includes("noreplicationenabled") ||
    ("code" in err && (errCode === "20" || errCode === "303"))
  );
}

export async function addTransaction(transactionData: NewTransaction) {
  assertObjectId(transactionData.walletId, "walletId");
  assertObjectId(transactionData.userId, "userId");

  if (!(await canUseTransactions())) {
    return await addTransactionWithRollback(transactionData);
  }

  try {
    return await addTransactionAtomic(transactionData);
  } catch (err) {
    if (isReplicaSetError(err)) {
      supportsTransactions = false;
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

export async function deleteTransaction(
  transactionId: string,
  userId: string
) {
  assertObjectId(transactionId, "transactionId");

  if (!(await canUseTransactions())) {
    await deleteTransactionWithRollback(transactionId, userId);
    return { success: true };
  }

  try {
    await deleteTransactionAtomic(transactionId, userId);
  } catch (err) {
    if (isReplicaSetError(err)) {
      supportsTransactions = false;
      await deleteTransactionWithRollback(transactionId, userId);
    } else {
      throw err;
    }
  }

  return { success: true };
}

async function calculateBalanceAdjustment(
  oldWalletId: string,
  newWalletId: string,
  oldType: "income" | "expense",
  newType: "income" | "expense",
  oldQuantity: number,
  newQuantity: number
): Promise<{ walletId: string; adjustment: number }[]> {
  const adjustments: { walletId: string; adjustment: number }[] = [];

  if (oldWalletId === newWalletId) {
    // Same wallet: net adjustment
    const oldImpact = oldType === "income" ? oldQuantity : -oldQuantity;
    const newImpact = newType === "income" ? newQuantity : -newQuantity;
    const net = newImpact - oldImpact;
    if (net !== 0) {
      adjustments.push({ walletId: oldWalletId, adjustment: net });
    }
  } else {
    // Different wallets: reverse old, apply new
    const oldImpact = oldType === "income" ? -oldQuantity : oldQuantity;
    const newImpact = newType === "income" ? newQuantity : -newQuantity;
    adjustments.push({ walletId: oldWalletId, adjustment: oldImpact });
    adjustments.push({ walletId: newWalletId, adjustment: newImpact });
  }

  return adjustments;
}

async function updateTransactionAtomic(
  transactionId: string,
  userId: string,
  updateData: UpdateTransactionData
) {
  const session = await mongoose.startSession();
  try {
    let updatedMovement: (typeof Movements.prototype) | null = null;
    await session.withTransaction(async () => {
      // 1. Fetch original transaction
      const original = await Movements.findOne({ _id: transactionId, userId }).session(session);
      if (!original) throw new Error("Movement not found or unauthorized");

      // 2. Determine old vs new values
      const oldWalletId = original.walletId.toString();
      const oldType = original.type;
      const oldQuantity = original.quantity;

      const newWalletId = updateData.walletId ?? oldWalletId;
      const newType = updateData.type ?? oldType;
      const newQuantity = updateData.quantity ?? oldQuantity;

      // 3. Calculate balance adjustments
      const adjustments = await calculateBalanceAdjustment(
        oldWalletId,
        newWalletId,
        oldType,
        newType,
        oldQuantity,
        newQuantity
      );

      // 4. Apply wallet balance updates
      for (const { walletId, adjustment } of adjustments) {
        const updateResult = await Wallet.updateOne(
          { _id: walletId, userId },
          { $inc: { balance: adjustment } },
          { session }
        );
        if (updateResult.matchedCount === 0) {
          throw new Error(`Wallet ${walletId} not found or unauthorized`);
        }
      }

      // 5. Update movement document
      const updateFields: Partial<UpdateTransactionData> = {};
      if (updateData.title !== undefined) updateFields.title = updateData.title;
      if (updateData.quantity !== undefined) updateFields.quantity = updateData.quantity;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.date !== undefined) updateFields.date = updateData.date;
      if (updateData.walletId !== undefined) updateFields.walletId = new mongoose.Types.ObjectId(updateData.walletId);
      if (updateData.type !== undefined) updateFields.type = updateData.type;
      if (updateData.category !== undefined) updateFields.category = updateData.category;

      const [updated] = await Movements.findByIdAndUpdate(
        transactionId,
        { $set: updateFields },
        { new: true, session }
      ).populate({
        path: 'walletId',
        select: 'name description currencyId',
        populate: { path: 'currencyId', select: 'name symbol' }
      });

      updatedMovement = updated;
    });
    return updatedMovement!;
  } finally {
    await session.endSession();
  }
}

async function updateTransactionWithRollback(
  transactionId: string,
  userId: string,
  updateData: UpdateTransactionData
) {
  // 1. Fetch original transaction
  const original = await Movements.findOne({ _id: transactionId, userId });
  if (!original) throw new Error("Movement not found or unauthorized");

  const oldWalletId = original.walletId.toString();
  const oldType = original.type;
  const oldQuantity = original.quantity;

  const newWalletId = updateData.walletId ?? oldWalletId;
  const newType = updateData.type ?? oldType;
  const newQuantity = updateData.quantity ?? oldQuantity;

  // 2. Calculate balance adjustments
  const adjustments = await calculateBalanceAdjustment(
    oldWalletId,
    newWalletId,
    oldType,
    newType,
    oldQuantity,
    newQuantity
  );

  // 3. Apply wallet balance updates
  for (const { walletId, adjustment } of adjustments) {
    const updateResult = await Wallet.updateOne(
      { _id: walletId, userId },
      { $inc: { balance: adjustment } }
    );
    if (updateResult.matchedCount === 0) {
      throw new Error(`Wallet ${walletId} not found or unauthorized`);
    }
  }

  // 4. Update movement document
  try {
    const updateFields: Partial<UpdateTransactionData> = {};
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.quantity !== undefined) updateFields.quantity = updateData.quantity;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.date !== undefined) updateFields.date = updateData.date;
    if (updateData.walletId !== undefined) updateFields.walletId = new mongoose.Types.ObjectId(updateData.walletId);
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.category !== undefined) updateFields.category = updateData.category;

    return await Movements.findByIdAndUpdate(
      transactionId,
      { $set: updateFields },
      { new: true }
    ).populate({
      path: 'walletId',
      select: 'name description currencyId',
      populate: { path: 'currencyId', select: 'name symbol' }
    });
  } catch (err) {
    // Rollback wallet balances on movement update failure
    for (const { walletId, adjustment } of adjustments) {
      await Wallet.updateOne(
        { _id: walletId, userId },
        { $inc: { balance: -adjustment } }
      );
    }
    throw err;
  }
}

export async function updateTransaction(
  transactionId: string,
  userId: string,
  updateData: UpdateTransactionData
) {
  assertObjectId(transactionId, "transactionId");
  assertObjectId(userId, "userId");

  if (updateData.walletId) {
    assertObjectId(updateData.walletId, "walletId");
  }

  if (!(await canUseTransactions())) {
    return await updateTransactionWithRollback(transactionId, userId, updateData);
  }

  try {
    return await updateTransactionAtomic(transactionId, userId, updateData);
  } catch (err) {
    if (isReplicaSetError(err)) {
      supportsTransactions = false;
      return await updateTransactionWithRollback(transactionId, userId, updateData);
    }
    throw err;
  }
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