import { TransactionCategory } from "@/lib/schemas";

export interface NewTransaction {
  title: string;
  quantity: number;
  description?: string;
  date: Date;
  userId: string;
  walletId: string;
  type: "income" | "expense";
  category?: TransactionCategory;
}

export interface UpdateTransactionData {
  title?: string;
  quantity?: number;
  description?: string;
  date?: Date;
  walletId?: string;
  type?: "income" | "expense";
  category?: TransactionCategory;
}