import "server-only";

import { logger } from "@/lib/logger";
import ExchangeRates from "@/models/ExchangeRates";

const TTL_MS = 24 * 60 * 60 * 1000;
const API_URL = "https://open.er-api.com/v6/latest/USD";

export interface RatesTable {
  base: string;
  rates: Record<string, number>;
  fetchedAt: Date;
}

/**
 * Lazily refreshes and caches a USD-anchored rates table in Mongo.
 * Falls back to the last known cache on API failure, and to null
 * (no conversion) if there is no cache yet and the API is unreachable.
 */
export async function getExchangeRates(): Promise<RatesTable | null> {
  const cached = await ExchangeRates.findOne({ base: "USD" }).lean<RatesTable | null>();
  const isStale = !cached || Date.now() - new Date(cached.fetchedAt).getTime() > TTL_MS;

  if (!isStale) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Exchange rate API returned ${res.status}`);

    const json = await res.json();
    if (json.result !== "success") throw new Error("Exchange rate API result != success");

    return await ExchangeRates.findOneAndUpdate(
      { base: "USD" },
      { base: "USD", rates: json.rates, fetchedAt: new Date() },
      { upsert: true, new: true },
    ).lean<RatesTable>();
  } catch (err) {
    logger.error("Exchange rate refresh failed, serving stale fallback", err);
    return cached ?? null;
  }
}

/**
 * Converts an amount between two ISO currency codes using a USD-anchored
 * rates table (rates[code] = units of `code` per 1 USD).
 */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number | null {
  if (from === to) return amount;

  const fromRate = from === "USD" ? 1 : rates[from];
  const toRate = to === "USD" ? 1 : rates[to];
  if (!fromRate || !toRate) return null;

  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}
