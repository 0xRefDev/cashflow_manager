export interface PreviewReport {
  quantity: number;
  description?: string;
  date: Date;
  title: string;
  userId?: string;
  category: string;
  walletId: string;
  type: "income" | "expense";
}

export interface Movement {
  _id: string;
  title: string;
  quantity: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
  userId: string;
  walletId: {
    _id: string;
    name: string;
    description?: string;
    currencyId: {
      name: string;
      symbol: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportsTableProps {
  reports?: (PreviewReport | Movement)[];
  headers: {
    label: string;
  }[];
}

export interface TransactionsData {
  transactions?: Movement[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export interface ReportsData {
  data?: Movement[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export interface SummaryReport {
  income: {
    quantity: number;
    percentage: number;
  },
  expenses: {
    quantity: number;
    percentage: number;
  },
  net_balance: number;
  baseCurrency: string;
}

/**
 * Period tokens exposed by the UI. "" is the "All Time" button and is
 * normalized to "all" before hitting the API.
 */
export type ReportPeriod = "week" | "month" | "quarter" | "year" | "all" | "";

/**
 * Client-side filter shape shared by the reports page, the filter bar,
 * and the client service. Mirrors the server's MovementFilters, plus the
 * UI-only "all"/"" sentinels for type/period which are stripped before fetch.
 */
export interface ReportFilters {
  period?: ReportPeriod;
  type?: "income" | "expense" | "all" | "";
  currencyId?: string;
  search?: string;
  from?: string;
  to?: string;
}