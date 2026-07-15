import { ReportsData, SummaryReport, ReportFilters } from "@/types/report.types";

/**
 * Serializes the active filters into query params, dropping empty values and
 * the UI-only sentinels ("all"/"") so the API only ever receives real filters.
 * "All Time" ("") is normalized to "all".
 */

function buildFilterParams(filters: ReportFilters = {}): URLSearchParams {
  const params = new URLSearchParams();
  const { period, type, currencyId, search, from, to } = filters;

  const normalizedPeriod = period === "" ? "all" : period;
  if (normalizedPeriod) params.set("period", normalizedPeriod);
  if (type && type !== "all") params.set("type", type);
  if (currencyId) params.set("currencyId", currencyId);
  if (search && search.trim()) params.set("search", search.trim());
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  return params;
}

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
  async movements(
    page: number,
    limit: number,
    filters: ReportFilters = {},
  ): Promise<ReportsData> {
    const params = buildFilterParams(filters);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`/api/v1/reports/live?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch movements");
    const data = await res.json();
    if (!data) return { data: [] };
    return data;
  },
  /**
   * Fetches every movement matching the active filters by walking all pages
   * at the API's max page size, for exports that must reflect the full
   * filtered result set rather than just the currently visible page.
   */
  async movementsAll(filters: ReportFilters = {}): Promise<ReportsData["data"]> {
    const EXPORT_PAGE_SIZE = 100;
    const first = await this.movements(1, EXPORT_PAGE_SIZE, filters);
    const all = [...(first.data ?? [])];
    const totalPages = first.pagination?.pages ?? 1;

    for (let page = 2; page <= totalPages; page++) {
      const next = await this.movements(page, EXPORT_PAGE_SIZE, filters);
      all.push(...(next.data ?? []));
    }

    return all;
  },
  async summary(filters: ReportFilters = {}): Promise<SummaryReport> {
    const params = buildFilterParams(filters);

    const res = await fetch(`/api/v1/reports/summary?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch summary report");
    const data = await res.json();
    if (!data)
      return {
        income: { quantity: 0, percentage: 0 },
        expenses: { quantity: 0, percentage: 0 },
        net_balance: 0,
        baseCurrency: "USD",
      };
    return data;
  },
};
