import { usePreferencesStore } from "@/store/usePreferencesStore";
import { formatCurrency, maskAmount, FormatCurrencyOptions } from "@/utils/formatCurrency";
import { useRates } from "@/hooks/useRates";
import { convertAmount } from "@/utils/currency";

export interface ConvertedResult {
  native: string;
  converted: string | null;
  combined: string;
}

export function usePreferences() {
  const {
    mask_balance,
    baseCurrency,
    spend_limit,
    auto_report,
    show_alerts,
    setMaskBalance,
    setBaseCurrency,
    setSpendLimit,
    setAutoReport,
    setShowAlerts,
    hydrate,
    reset,
  } = usePreferencesStore();

  const rates = useRates();

  const formatAmount = (amount: number, options?: Partial<FormatCurrencyOptions>) =>
    formatCurrency(amount, { currency: baseCurrency, mask: mask_balance, ...options });

  const maskValue = (amount: number, options?: Partial<FormatCurrencyOptions>) =>
    maskAmount(amount, { currency: baseCurrency, ...options });

  const formatConverted = (
    amount: number,
    fromCode: string,
    options?: Partial<FormatCurrencyOptions>,
  ): ConvertedResult => {
    const base = baseCurrency ?? "USD";
    const native = formatCurrency(amount, {
      currency: fromCode,
      mask: mask_balance,
      ...options,
    });

    if (fromCode === base) {
      return { native, converted: null, combined: native };
    }

    const rawConverted = convertAmount(amount, fromCode, base, rates);
    if (rawConverted === null) {
      return { native, converted: null, combined: native };
    }

    const converted = formatCurrency(rawConverted, {
      currency: base,
      mask: mask_balance,
      ...options,
    });

    return { native, converted, combined: `${native} (≈ ${converted})` };
  };

  return {
    maskBalance: mask_balance ?? false,
    baseCurrency: baseCurrency ?? "USD",
    spendLimit: spend_limit ?? 0,
    autoReport: auto_report ?? false,
    showAlerts: show_alerts ?? true,

    setMaskBalance,
    setBaseCurrency,
    setSpendLimit,
    setAutoReport,
    setShowAlerts,
    hydrate,
    reset,

    formatAmount,
    maskValue,
    formatConverted,
  };
}