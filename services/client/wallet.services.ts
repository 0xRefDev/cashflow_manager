import { CreateWallet, Wallet } from "@/types/wallet.types";

export const walletService = {

  async topWallets(): Promise<Wallet[]> {
    const res = await fetch("/api/v1/wallet/main", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch top wallets");
    const data = await res.json();
    if (!data.wallet) return [];
    return data.wallet;
  },

  async getAll(): Promise<Wallet[]> {
    const res = await fetch("/api/v1/wallet", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch wallets");
    const data = await res.json();
    if (!data.wallets) return [];
    return data.wallets;
  },

  async create(payload: CreateWallet): Promise<Wallet> {
    const res = await fetch("/api/v1/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Failed to create wallet");
    }

    const data = await res.json();
    return data.wallet;
  },

  async update(walletId: string, payload: Partial<CreateWallet>): Promise<Wallet> {
    const res = await fetch(`/api/v1/wallet?id=${walletId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Failed to update wallet");
    }

    const data = await res.json();
    return data.wallet;
  },

  async remove(walletId: string): Promise<void> {
    const res = await fetch(`/api/v1/wallet?id=${walletId}`, { method: "DELETE" });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Failed to delete wallet");
    }
  },
}