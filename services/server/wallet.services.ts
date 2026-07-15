import "server-only";

import mongoose from "mongoose";
import { CreateWallet, UserId } from "@/types/wallet.types";
import User from "@/models/User";
import Currencies from "@/models/Currencies";
import Wallet from "@/models/Wallets";
import { assertObjectId } from "@/lib/api";

interface UpdateWalletInput {
  name?: string;
  description?: string;
  currencyId?: string;
}

export async function createWallet(data: CreateWallet & UserId) {
  try {
    const { name, balance, description, currencyId, userId } = data;

    if (!name || typeof balance !== "number" || balance < 0 || !currencyId) {
      throw new Error("Please provide a valid wallet name, balance and currency.");
    }

    if (!userId) {
      throw new Error("User ID is missing.");
    }

    const [user, currency] = await Promise.all([
      User.findById(userId),
      Currencies.findById(currencyId),
    ]);

    if (!user || !currency) throw new Error("User or currency not found");

    const wallet = await Wallet.create({
      name,
      balance,
      description,
      currencyId,
      userId,
    });

    return wallet.populate("currencyId");

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

/* =============================
   =========== READ ===========
   ============================= */

export async function getWalletByUserId(userId: string) {
  try {
    if (!userId) throw new Error("User ID is missing.");

    const wallets = await Wallet.find({ userId }).populate('currencyId');

    if (!wallets) throw new Error("No wallets found for this user");

    return wallets;

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

export async function getWalletById(walletId: string, userId: string) {
  assertObjectId(walletId, "walletId");

  try{
    if(!userId) throw new Error("User ID is missing.");

    const wallet = await Wallet.findOne({ _id: walletId, userId: userId }).populate('currencyId');

    if(!wallet) throw new Error("Wallet not found");

    return wallet;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

/* =============================
   ========== UPDATE ===========
   ============================= */

export async function updateWallet(walletId: string, userId: string, data: UpdateWalletInput) {
  assertObjectId(walletId, "walletId");

  try {
    if (!userId) throw new Error("User ID is missing.");

    if (data.currencyId) {
      const currency = await Currencies.findById(data.currencyId);
      if (!currency) throw new Error("Currency not found");
    }

    const wallet = await Wallet.findOneAndUpdate(
      { _id: walletId, userId },
      { $set: data },
      { new: true }
    ).populate("currencyId");

    if (!wallet) throw new Error("Wallet not found");

    return wallet;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

/* =============================
   =========== DELETE ==========
   ============================= */

export async function deleteWallet(walletId: string, userId: string) {
  assertObjectId(walletId, "walletId");

  try {
    if (!userId) throw new Error("User ID is missing.");

    const wallet = await Wallet.findOneAndDelete({ _id: walletId, userId });

    if (!wallet) throw new Error("Wallet not found");

    return wallet;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

export async function getTopWallets(userId: string, limit: number = 3) {
  try {
    if (!userId) throw new Error("User ID is missing.");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const wallets = await Wallet.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { balance: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'movements',
          let: { walletId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$walletId', '$$walletId'] },
                date: { $gte: sevenDaysAgo }
              }
            },
            {
              $project: {
                title: 1,
                quantity: 1,
                date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                type: 1
              }
            },
            { $sort: { date: 1 } }
          ],
          as: 'transactions'
        }
      },
      {
        $lookup: {
          from: 'currencies',
          localField: 'currencyId',
          foreignField: '_id',
          as: 'currencyId'
        }
      },
      { $unwind: '$currencyId' }
    ]);

    if (!wallets) throw new Error("No wallets found for this user");

    return wallets;

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}