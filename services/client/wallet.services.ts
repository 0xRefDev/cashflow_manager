import { Wallet } from "@/types/wallet.types";

export const walletService = {

  async topWallets(): Promise<Wallet[]> {
    const res = await fetch("/api/v1/wallet/main", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch top wallets");
    const data = await res.json();
    if (!data.wallet) return [];
    return data.wallet;
  }
}