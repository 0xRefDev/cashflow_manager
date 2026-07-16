import { usePreferencesStore } from "@/store/usePreferencesStore";
import { formatCurrency, maskAmount, FormatCurrencyOptions } from "@/utils/formatCurrency";

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

  const formatAmount = (amount: number, options?: Partial<FormatCurrencyOptions>) =>
    formatCurrency(amount, { currency: baseCurrency, mask: mask_balance, ...options });

  const maskValue = (amount: number, options?: Partial<FormatCurrencyOptions>) =>
    maskAmount(amount, { currency: baseCurrency, ...options });

  return {
    maskBalance: mask_balance,
    baseCurrency,
    spendLimit: spend_limit,
    autoReport: auto_report,
    showAlerts: show_alerts,

    setMaskBalance,
    setBaseCurrency,
    setSpendLimit,
    setAutoReport,
    setShowAlerts,
    hydrate,
    reset,

    formatAmount,
    maskValue,
  };
}