import { safeAdd, safeSubtract } from "@/utils/math";

const CURRENCY_DECIMALS: Record<string, number> = {
  VES: 2,
  JPY: 0,
  KRW: 0,
  CLP: 0,
  PYG: 0,
  VND: 0,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  VES: "Bs.",
  COP: "$",
  ARS: "$",
  BRL: "R$",
  MXN: "$",
  CLP: "$",
  PEN: "S/",
  UYU: "$",
  PYG: "₲",
  CRC: "₡",
  PAB: "B/.",
  INR: "₹",
  KRW: "₩",
  RUB: "₽",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
};

export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency.toUpperCase()] ?? 2;
}

export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code.toUpperCase()] ?? code;
}

export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
  mask?: boolean;
  maskChar?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
  compact?: boolean;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    mask = false,
    maskChar = "*",
    minimumFractionDigits,
    maximumFractionDigits,
    showSymbol = true,
    compact = false,
  } = options;

  if (mask) {
    return maskAmount(amount, { maskChar, locale, currency, showSymbol });
  }

  const decimals =
    minimumFractionDigits ?? maximumFractionDigits ?? getCurrencyDecimals(currency);

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showSymbol ? "currency" : "decimal",
      currency: showSymbol ? currency : undefined,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: compact ? "compact" : "standard",
      compactDisplay: "short",
    });
    return formatter.format(amount);
  } catch {
    const symbol = showSymbol ? getCurrencySymbol(currency) : "";
    const fixed = amount.toFixed(decimals);
    return `${symbol}${fixed}`;
  }
}

export function maskAmount(
  amount: number,
  options: { maskChar?: string; locale?: string; currency?: string; showSymbol?: boolean } = {}
): string {
  const { maskChar = "*", locale = "en-US", currency = "USD", showSymbol = true } = options;

  const decimals = getCurrencyDecimals(currency);
  const formatted = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount));

  const masked = formatted.replace(/\d/g, maskChar);
  const symbol = showSymbol ? getCurrencySymbol(currency) : "";
  const sign = amount < 0 ? "-" : "";

  return `${sign}${symbol}${masked}`;
}

export const currencyMath = {
  add: safeAdd,
  subtract: safeSubtract,
  multiply: (a: number, b: number) => Math.round(a * b * 100) / 100,
  divide: (a: number, b: number) => Math.round((a / b) * 100) / 100,
};