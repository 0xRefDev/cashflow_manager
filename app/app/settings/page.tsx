"use client";

import { useState, useEffect } from "react";
import { currencyService } from "@/services/client/currencies.services";
import { useRouter } from "next/navigation";

import { MainHeader } from "@/components/app/MainHeader";
import { Input } from "@/components/Input";
import { ToggleButton } from "@/components/app/ToggleButton";
import { Divider } from "@/components/app/Divider";
import { CryptoAdvice } from "@/components/app/CryptoAdvice";
import { FloatingContainer } from "@/components/app/FloatingContainer";
import { CurrencySelect } from "@/components/app/CurrencySelect";

import { Currency } from "@/types/currencies.types";
import { usePreferences } from "@/hooks/usePreferences";

import { Help } from "@/icons/Help";
import { USD } from "@/icons/currencies/USD";
import { Hide } from "@/icons/app/Hide";
import { Reports } from "@/icons/Reports";

export default function Page() {
  const router = useRouter();
const {
    maskBalance,
    baseCurrency,
    spendLimit,
    autoReport,
    showAlerts,
    setMaskBalance,
    setBaseCurrency,
    setSpendLimit,
    setAutoReport,
    setShowAlerts,
    hydrate,
  } = usePreferences();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [originalPrefs, setOriginalPrefs] = useState({
    maskBalance: false,
    baseCurrency: "USD",
    spendLimit: 0,
    autoReport: false,
    showAlerts: true,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  const headerOptions = [
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("cashflow-preferences");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        hydrate(parsed);
        setOriginalPrefs({
          maskBalance: parsed.mask_balance ?? false,
          baseCurrency: parsed.baseCurrency ?? "USD",
          spendLimit: parsed.spend_limit ?? 0,
          autoReport: parsed.auto_report ?? false,
          showAlerts: parsed.show_alerts ?? true,
        });
      } catch {}
    }
    setIsHydrated(true);
  }, [hydrate]);

  useEffect(() => {
    currencyService.get().then(setCurrencies).catch(console.error);
  }, []);

  const hasChanges =
    spendLimit !== originalPrefs.spendLimit ||
    baseCurrency !== originalPrefs.baseCurrency ||
    maskBalance !== originalPrefs.maskBalance ||
    autoReport !== originalPrefs.autoReport ||
    showAlerts !== originalPrefs.showAlerts;

  const handleSave = () => {
    setOriginalPrefs({
      maskBalance: maskBalance ?? false,
      baseCurrency: baseCurrency ?? "USD",
      spendLimit: spendLimit ?? 0,
      autoReport: autoReport ?? false,
      showAlerts: showAlerts ?? true,
    });
    router.refresh();
  };

  const handleDiscard = () => {
    setMaskBalance(originalPrefs.maskBalance);
    setBaseCurrency(originalPrefs.baseCurrency);
    setSpendLimit(originalPrefs.spendLimit);
    setAutoReport(originalPrefs.autoReport);
    setShowAlerts(originalPrefs.showAlerts);
  };

  return (
    <section className="h-full text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              General Settings
            </p>
          </div>
        }
        options={headerOptions}
      />

      {hasChanges && (
        <FloatingContainer onSave={handleSave} onDiscard={handleDiscard} />
      )}

      <article className="grid grid-cols-1 items-center gap-4 p-16">
        <div className="flex p-4 gap-2">
          <div className="flex flex-col gap-1 mb-4 px-2">
            <h2 className="text-2xl font-medium">Financial Limits</h2>
            <p className="text-md text-[#ADAAAA] mt-1">
              Control your monthly expenditure thresholds to stay within budget.
            </p>
          </div>
          <div className="bg-[#131313] w-full p-4 py-8 rounded-xl shadow-2xl shadow-black/25 flex flex-col gap-1 relative border border-[#ADAAAA]/5">
            <USD className="size-4.5 text-landing-primary/80 absolute left-7 top-[53%]" />
            <label htmlFor="spend_limit" className="ml-1 text-sm text-[#ADAAAA]">
              Monthly Spending Limit
            </label>
            <Input
              value={spendLimit || ""}
              onChange={(e) => setSpendLimit(Number(e.target.value))}
              placeholder="0.00"
              type="number"
              id="spend_limit"
              className="w-full pl-9"
            />
          </div>
        </div>
        <div className="flex p-4 gap-8">
          <div className="flex flex-col gap-1 mb-4 px-2">
            <h2 className="text-2xl font-medium">Currency Preferences</h2>
            <p className="text-md text-[#ADAAAA] mt-1">
              Select the primary currency for your dashboard and reporting.
            </p>
          </div>
          <div className="bg-[#131313] w-full p-4 py-8 rounded-xl shadow-2xl shadow-black/25 flex flex-col gap-1 relative border border-[#ADAAAA]/5">
            <USD className="size-4.5 text-landing-primary/80 absolute left-7 top-[53%]" />
            <label htmlFor="baseCurrency" className="ml-1 text-sm text-[#ADAAAA]">
              Default Currency
            </label>
            <CurrencySelect
              currencies={currencies}
              keyBy="name"
              value={baseCurrency}
              onChange={setBaseCurrency}
              className="w-full"
            />
          </div>
        </div>

        <Divider />

        <div className="flex p-4 gap-2">
          <div className="flex flex-col gap-1 mb-4 px-2">
            <h2 className="text-2xl font-medium">Notifications</h2>
            <p className="text-md text-[#ADAAAA] mt-1">
              Stay updated on your account activity and critical financial
              events.
            </p>
          </div>
          <article className="flex flex-col gap-4 w-full">
            <div className="bg-[#131313] w-full pl-6 py-8 rounded-xl shadow-2xl shadow-black/25 flex items-center justify-between pr-12 gap-1 relative border border-[#ADAAAA]/5">
              <div className="flex items-center gap-6">
                <Hide className="w-6 h-auto text-landing-primary" />
                <div>
                  <h2 className="text-lg font-medium">Mask Balances</h2>
                  <p className="text-sm text-[#ADAAAA] mt-1">
                    Hide sensitive figures from the main dashboard
                  </p>
                </div>
              </div>
              <ToggleButton value={maskBalance} onChange={setMaskBalance} />
            </div>
            <div className="bg-[#131313] w-full pl-6 py-8 rounded-xl shadow-2xl shadow-black/25 flex items-center justify-between pr-12 gap-1 relative border border-[#ADAAAA]/5">
              <div className="flex items-center gap-6">
                <Reports className="w-6 h-auto text-landing-primary" />
                <div>
                  <h2 className="text-lg font-medium">Monthly Summary</h2>
                  <p className="text-sm text-[#ADAAAA] mt-1">
                    Receive an automated PDF report every 1st of the month
                  </p>
                </div>
              </div>
              <ToggleButton value={autoReport} onChange={setAutoReport} />
            </div>
          </article>
        </div>
        <Divider />
        <CryptoAdvice />
      </article>
    </section>
  );
}