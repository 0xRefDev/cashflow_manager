import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getWalletByUserId } from "@/services/server/wallet.services";
import { serverError, clientError } from "@/lib/api";
import { WalletOption } from "@/types/wallet.types";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const wallets = await getWalletByUserId(userId);

    const formatted: WalletOption[] = wallets.map((w: any) => ({
      walletId: w._id.toString(),
      wallet: w.name,
      currencyId: w.currencyId._id.toString(),
      currency: w.currencyId.name,
      symbol: w.currencyId.symbol,
      balance: w.balance,
    }));

    return NextResponse.json({ success: true, wallets: formatted });
  } catch (err) {
    return serverError();
  }
}
