export interface WalletOption {
  walletId: string;
  wallet: string;
  currencyId: string;
  currency: string;
  symbol: string;
  balance: number;
}

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

export interface WalletTransaction {
  title: string;
  quantity: number;
  date: string;
  type: "income" | "expense";
}

export interface Wallet {
  _id: string;
  name: string;
  description?: string;
  balance: number;
  percentage: number;
  currencyId: {
    _id: string;
    name: string;
    symbol: string;
  };
  transactions: WalletTransaction[];
}