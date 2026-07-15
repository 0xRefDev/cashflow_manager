import { Movement, SummaryReport, ReportFilters } from "@/types/report.types";

const PERIOD_LABELS: Record<string, string> = {
  week: "Last 7 days",
  month: "Current month",
  quarter: "Current quarter",
  year: "Current year",
  all: "All time",
  "": "All time",
};

const TYPE_LABELS: Record<string, string> = {
  income: "Income only",
  expense: "Expense only",
  all: "Income & Expense",
  "": "Income & Expense",
};

function formatFiltersSummary(filters: ReportFilters): string[] {
  const chips: string[] = [];
  chips.push(PERIOD_LABELS[filters.period ?? ""] ?? "All time");
  chips.push(TYPE_LABELS[filters.type ?? ""] ?? "Income & Expense");
  if (filters.currencyId) chips.push("Currency filtered");
  if (filters.search?.trim()) chips.push(`Search: "${filters.search.trim()}"`);
  if (filters.from || filters.to) {
    const from = filters.from ? new Date(filters.from).toLocaleDateString("en-US") : "…";
    const to = filters.to ? new Date(filters.to).toLocaleDateString("en-US") : "…";
    chips.push(`Range: ${from} – ${to}`);
  }
  return chips;
}

export interface ReportPdfTemplateProps {
  movements: Movement[];
  summary: SummaryReport;
  filters: ReportFilters;
  generatedAt: Date;
}

export function ReportPdfTemplate({
  movements,
  summary,
  filters,
  generatedAt,
}: ReportPdfTemplateProps) {
  const filterChips = formatFiltersSummary(filters);

  return (
    <div
      style={{
        width: "780px",
        backgroundColor: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: "Inter, Manrope, sans-serif",
        padding: "36px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid #222",
          paddingBottom: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#3FFF8B", margin: 0 }}>
            CashFlow
          </p>
          <p style={{ fontSize: "13px", color: "#ADAAAA", margin: "4px 0 0" }}>
            Financial Movements Report
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "12px", color: "#ADAAAA", margin: 0 }}>Generated on</p>
          <p style={{ fontSize: "13px", color: "#FFFFFF", margin: "2px 0 0" }}>
            {generatedAt.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
        {filterChips.map((chip) => (
          <span
            key={chip}
            style={{
              fontSize: "11px",
              color: "#ADAAAA",
              border: "1px solid #222",
              borderRadius: "6px",
              padding: "4px 10px",
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
        <div style={{ flex: 1, border: "1px solid #222", borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "11px", color: "#ADAAAA", margin: 0, textTransform: "uppercase" }}>
            Total Income
          </p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#3FFF8B", margin: "6px 0 0" }}>
            {summary.income.quantity.toFixed(2)} {summary.baseCurrency}
          </p>
        </div>
        <div style={{ flex: 1, border: "1px solid #222", borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "11px", color: "#ADAAAA", margin: 0, textTransform: "uppercase" }}>
            Total Expenses
          </p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#FF7351", margin: "6px 0 0" }}>
            {summary.expenses.quantity.toFixed(2)} {summary.baseCurrency}
          </p>
        </div>
        <div style={{ flex: 1, border: "1px solid #222", borderRadius: "10px", padding: "14px" }}>
          <p style={{ fontSize: "11px", color: "#ADAAAA", margin: 0, textTransform: "uppercase" }}>
            Net Balance
          </p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#FFFFFF", margin: "6px 0 0" }}>
            {summary.net_balance.toFixed(2)} {summary.baseCurrency}
          </p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#131313" }}>
            {["Date", "Description", "Wallet", "Category", "Amount"].map((label) => (
              <th
                key={label}
                style={{
                  textAlign: label === "Amount" ? "right" : "left",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#ADAAAA",
                  padding: "10px",
                  borderBottom: "1px solid #222",
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement._id} style={{ breakInside: "avoid" }}>
              <td style={{ padding: "10px", borderBottom: "1px solid #1a1a1a", fontSize: "12px", color: "#ADAAAA" }}>
                {new Date(movement.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #1a1a1a", fontSize: "12px" }}>
                <div style={{ color: "#FFFFFF", fontWeight: 600 }}>{movement.title}</div>
                <div style={{ color: "#ADAAAA", fontSize: "11px" }}>
                  {movement.description || "No description"}
                </div>
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #1a1a1a", fontSize: "12px", color: "#ADAAAA" }}>
                {movement.walletId.name}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #1a1a1a", fontSize: "12px", color: "#ADAAAA" }}>
                {movement.category}
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #1a1a1a",
                  fontSize: "12px",
                  fontWeight: 600,
                  textAlign: "right",
                  color: movement.type === "income" ? "#3FFF8B" : "#FF7351",
                }}
              >
                {movement.type === "income" ? "+" : "-"}
                {movement.walletId.currencyId.symbol}
                {movement.quantity.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {movements.length === 0 && (
        <p style={{ textAlign: "center", color: "#ADAAAA", padding: "32px", fontStyle: "italic" }}>
          No movements found for the selected filters.
        </p>
      )}

      <p style={{ fontSize: "10px", color: "#555", textAlign: "center", marginTop: "28px" }}>
        CashFlow — Sovereign Ledger. This document is a tracking record, not a bank statement.
      </p>
    </div>
  );
}
