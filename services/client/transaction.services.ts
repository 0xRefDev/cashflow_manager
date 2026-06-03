export const transactionService = {
  async create(data: {
    title: string;
    quantity: number;
    description?: string;
    date: string;
    walletId: string;
    type: "income" | "expense";
    category?: string;
  }) {
    const res = await fetch("/api/v1/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create transaction");
    }
    return res.json();
  }
};
