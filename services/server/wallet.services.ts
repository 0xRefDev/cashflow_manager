import "server-only";

import { CreateWallet, UserId, UpdateBalance } from "@/types/wallet.types";
import User from "@/models/User";
import Currencies from "@/models/Currencies";
import Wallet from "@/models/Wallets";
import { assertObjectId } from "@/lib/api";

export async function createWallet(data: CreateWallet & UserId) {
  try {
    const { name, balance, description, currencyId, userId } = data;

    if (!name || !balance || !description || !currencyId) {
      throw new Error("Please provide a valid wallet name, balance, description and currency.");
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

    return wallet;

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

export async function getTopWallets(userId: string, limit: number = 3) {
  try {
    if(!userId) throw new Error("User ID is missing.");

    const wallets = await Wallet.find({userId}).sort({ balance: -1 }).limit(limit).populate('currencyId');

    if (!wallets) throw new Error("No wallets found for this user");

    return wallets;
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}