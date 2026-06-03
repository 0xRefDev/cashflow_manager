import { Currency } from "@/types/currencies.types";

export const currencyService = {
  async get(): Promise<Currency[]> { 
    const res = await fetch("/api/v1/currency", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch currency data");
    const data = await res.json();
    if (!data?.currencies) throw new Error("Failed to fetch currency data");
    return data.currencies;
  },
};