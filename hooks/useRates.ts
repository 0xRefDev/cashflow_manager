import { useEffect, useState } from "react";

let ratesPromise: Promise<Record<string, number>> | null = null;

async function fetchRates(): Promise<Record<string, number>> {
  if (!ratesPromise) {
    ratesPromise = fetch("/api/v1/currency/rates")
      .then((res) => res.json())
      .then((data) => data?.rates ?? {})
      .catch(() => {
        ratesPromise = null;
        return {};
      });
  }
  return ratesPromise;
}

export function useRates() {
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    fetchRates().then((r) => {
      if (active) setRates(r);
    });
    return () => {
      active = false;
    };
  }, []);

  return rates;
}
