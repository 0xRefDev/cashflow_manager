"use client";

import { useState, useEffect } from "react";
import {
  preferencesService,
  getPreferences,
} from "@/services/client/preferences.services";

import { MainHeader } from "@/components/app/MainHeader";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { ToggleButton } from "@/components/app/ToggleButton";
import { Divider } from "@/components/app/Divider";
import { CryptoAdvice } from "@/components/app/CryptoAdvice";
import { FloatingContainer } from "@/components/app/FloatingContainer";

import { Settings } from "@/types/settings.types";
import { useRouter } from "next/navigation";

import { Help } from "@/icons/Help";
import { Bell } from "@/icons/app/Bell";
import { USD } from "@/icons/currencies/USD";
import { Hide } from "@/icons/app/Hide";
import { Reports } from "@/icons/Reports";

export default function Page() {
  const router = useRouter();
  const [userPreferences, setUserPreferences] = useState<Settings>({});
  const [originalPreferences, setOriginalPreferences] = useState<Settings>({});

  const headerOptions = [
    {
      label: <Bell className="w-6 h-6" />,
      action: () => router.push("/app/notifications"),
    },
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];

  const hasChanges =
    JSON.stringify(originalPreferences) !== JSON.stringify(userPreferences);

  useEffect(() => {
    getPreferences()
      .then((preferences) => {
        setUserPreferences(preferences);
        setOriginalPreferences(preferences);
        const state = JSON.parse(
          localStorage.getItem("userPreferences") || "{}",
        );
        localStorage.setItem(
          "userPreferences",
          JSON.stringify({ ...state, ...preferences }),
        );
      })
      .catch((error) => {
        console.error("Error to get user preferences:", error);
      });
  }, []);

  const getChangedFields = (
    original: Settings,
    current: Settings,
  ): Partial<Settings> => {
    return Object.fromEntries(
      Object.entries(current).filter(
        ([key, value]) => value !== original[key as keyof Settings],
      ),
    ) as Partial<Settings>;
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
        <FloatingContainer
          onSave={() => {
            const changedFields = getChangedFields(
              originalPreferences,
              userPreferences,
            );
            preferencesService.update(changedFields).then((updated) => {
              const newPreferences = { ...originalPreferences, ...updated };

              setOriginalPreferences(newPreferences);
              setUserPreferences(newPreferences);

              localStorage.setItem(
                "userPreferences",
                JSON.stringify(newPreferences),
              );
              router.refresh();
            });
          }}
          onDiscard={() => setUserPreferences(originalPreferences)}
        />
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
            <label
              htmlFor="spend_limit"
              className="ml-1 text-sm text-[#ADAAAA]"
            >
              Monthly Spending Limit
            </label>
            <Input
              value={userPreferences.spend_limit || ""}
              onChange={(e) =>
                setUserPreferences((prev) => ({
                  ...prev,
                  spend_limit: Number(e.target.value),
                }))
              }
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
            <label
              htmlFor="spend_limit"
              className="ml-1 text-sm text-[#ADAAAA]"
            >
              Default Currency
            </label>
            <Select
              options={[
                { label: "USD - US Dollar", value: "USD" },
                { label: "EUR - Euro", value: "EUR" },
                { label: "GBP - British Pound", value: "GBP" },
                { label: "JPY - Japanese Yen", value: "JPY" },
                { label: "AUD - Australian Dollar", value: "AUD" },
              ]}
              id="spend_limit"
              className="w-full pl-9"
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
              <ToggleButton
                value={userPreferences.mask_balance ?? false}
                onChange={(val) =>
                  setUserPreferences((prev) => ({ ...prev, mask_balance: val }))
                }
              />
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
              <ToggleButton
                value={userPreferences.auto_report ?? false}
                onChange={(val) =>
                  setUserPreferences((prev) => ({ ...prev, auto_report: val }))
                }
              />
            </div>
          </article>
        </div>
        <Divider />
        <CryptoAdvice />
      </article>
    </section>
  );
}
