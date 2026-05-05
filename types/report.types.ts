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
  type: string;
  userId: string;
  walletId: {
    _id: string;
    name: string;
    description: string;
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
};
