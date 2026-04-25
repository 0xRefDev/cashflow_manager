import "server-only";

import Currencies from "@/models/Currencies";

export async function getAllCurrencies() {
  try {
    const currencies = await Currencies.find({});
    return currencies;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to get all currencies: " + errorMessage);
  }
}

export async function getCurrencyByName(name:string) {
  
  if (!name) throw new Error("Currency name is required");

  try {
    const currency = await Currencies.findOne({ name });
    return currency;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(err);
    throw new Error("Failed to get currency by name: " + errorMessage);
  }
}