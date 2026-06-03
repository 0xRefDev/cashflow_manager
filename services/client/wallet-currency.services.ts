import { WalletOption } from "@/types/wallet.types";

export const walletCurrencyService = {
  async getUserWallets(): Promise<WalletOption[]> {
    const res = await fetch("/api/v1/currency/wallets", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch wallets");
    const data = await res.json();
    return data.wallets ?? [];
  }
};
