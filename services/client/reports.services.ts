import { TransactionsData } from "@/types/report.types";

export const transactionService = {

  async recentlyMovements(): Promise<TransactionsData> {
    const res = await fetch("/api/v1/transactions?limit=5", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch recently movements");
    const data = await res.json();
    if (!data?.transactions) return { transactions: [] };
    return data;
  }
}