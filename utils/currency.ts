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
