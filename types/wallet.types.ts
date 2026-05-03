export interface CreateWallet {
  name: string;
  description?: string;
  balance: number;
  currencyId: string;
}

export interface UserId {
  userId: string;
}

export interface UpdateBalance {
  walletId: string;
  balance: number;
  userId: string;
  type: "income" | "expense";
}