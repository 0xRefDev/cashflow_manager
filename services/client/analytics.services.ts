export const analyticsService = {
  async getSummary() {
    const res = await fetch("/api/v1/analytics/summary", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch analytics summary");
    }
    return res.json();
  },

  async getChartData(period: "30d" | "6m" | "1y" = "30d") {
    const res = await fetch(`/api/v1/analytics/chart?period=${period}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch chart data");
    }
    return res.json();
  },

  async getWalletDistribution() {
    const res = await fetch("/api/v1/analytics/distribution", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch wallet distribution");
    }
    return res.json();
  },
};