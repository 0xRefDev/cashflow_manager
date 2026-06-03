import { ReportsData, SummaryReport } from "@/types/report.types";

export const transactionService = {
  async recentlyMovements(): Promise<ReportsData> {
    const res = await fetch("/api/v1/transactions?limit=5", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch recently movements");
    const data = await res.json();
    if (!data?.transactions) return { data: [] };
    return data;
  },
  async movements(page: number, limit: number): Promise<ReportsData> {
    const res = await fetch(
      `/api/v1/reports/live?page=${page}&limit=${limit}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch movements");
    const data = await res.json();
    if (!data) return { data: [] };
    return data;
  },
  async summary(period: string): Promise<SummaryReport> {
    const res = await fetch(
      `/api/v1/reports/summary?period=${period}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch summary report");
    const data = await res.json();
    if (!data) return { income: { quantity: 0, percentage: 0 }, expenses: { quantity: 0, percentage: 0 }, net_balance: 0 };
    return data;
  },
};
