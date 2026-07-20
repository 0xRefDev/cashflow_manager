export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (from === to) return amount;

  const fromRate = from === "USD" ? 1 : rates[from];
  const toRate = to === "USD" ? 1 : rates[to];

  if (!fromRate || !toRate) return amount;

  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}
