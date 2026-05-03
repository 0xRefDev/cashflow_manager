import "server-only";

import { logger } from "@/lib/logger";
import Currencies from "@/models/Currencies";

export async function getAllCurrencies() {
  try {
    const currencies = await Currencies.find({});
    return currencies;
  } catch (err) {
    logger.error("Failed to get all currencies", err);
    throw new Error("Failed to get all currencies");
  }
}

export async function getCurrencyByName(name: string) {
  if (!name) throw new Error("Currency name is required");

  try {
    const currency = await Currencies.findOne({ name });
    return currency;
  } catch (err) {
    logger.error("Failed to get currency by name", err, { name });
    throw new Error("Failed to get currency by name");
  }
}
