import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { PeriodSelector, Period } from "@/components/app/PeriodSelector";
import { CurrencySelect } from "@/components/app/CurrencySelect";

import { Calendar } from "@/icons/app/Calendar";
import { Search } from "@/icons/app/Search";

import { Currency } from "@/types/currencies.types";
import { currencyService } from "@/services/client/currencies.services";

export interface ReportsFilterValues {
  search: string;
  currencyId: string;
  type: "income" | "expense" | "all";
  from: string;
  to: string;
}

interface ReportsFilterProps {
  onApply: (filters: ReportsFilterValues) => void;
  onPeriodChange: (period: Period) => void;
  defaultPeriod?: Period;
}

const EMPTY_FILTERS: ReportsFilterValues = {
  search: "",
  currencyId: "",
  type: "all",
  from: "",
  to: "",
};

function formatDateDisplay(raw: string, placeholder: string): string {
  if (!raw) return placeholder;
  const date = new Date(raw + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function ReportsFilter({
  onApply,
  onPeriodChange,
  defaultPeriod = "month",
}: ReportsFilterProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [draft, setDraft] = useState<ReportsFilterValues>(EMPTY_FILTERS);

  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const currency = await currencyService.get();
        setCurrencies(currency);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }

    fetchCurrencies();
  }, []);

  const update = <K extends keyof ReportsFilterValues>(
    key: K,
    value: ReportsFilterValues[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => onApply(draft);

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <article className="w-full p-4 rounded-lg rounded-bl-none bg-[#131313]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-x-6 gap-y-3 flex-wrap">
          <div className="flex items-center gap-2 relative">
            <Search className="absolute left-3 text-[#ADAAAA]" />
            <Input
              placeholder="Search by name, category, or amount"
              type="text"
              name="search"
              id="search"
              className="py-3 pl-10"
              value={draft.search}
              onChange={(e) => update("search", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex relative items-center gap-2 bg-black p-1.5 rounded-lg">
            <label
              htmlFor="date-from"
              className="bg-[#262626] p-1.5 rounded-md whitespace-nowrap text-sm"
            >
              From
            </label>
            <div className="relative flex items-center gap-6 px-2">
              <input
                ref={fromInputRef}
                type="date"
                id="date-from"
                value={draft.from}
                max={draft.to || undefined}
                onChange={(e) => update("from", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <span className="text-[#ADAAAA] text-sm whitespace-nowrap">
                {formatDateDisplay(draft.from, "Start date")}
              </span>
              <Calendar
                className="size-5 cursor-pointer text-[#ADAAAA]"
                onClick={() => fromInputRef.current?.showPicker()}
              />
            </div>
          </div>

          <div className="flex relative items-center gap-2 bg-black p-1.5 rounded-lg">
            <label
              htmlFor="date-to"
              className="bg-[#262626] p-1.5 rounded-md whitespace-nowrap text-sm"
            >
              To
            </label>
            <div className="relative flex items-center gap-6 px-2">
              <input
                ref={toInputRef}
                type="date"
                id="date-to"
                value={draft.to}
                min={draft.from || undefined}
                onChange={(e) => update("to", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <span className="text-[#ADAAAA] text-sm whitespace-nowrap">
                {formatDateDisplay(draft.to, "End date")}
              </span>
              <Calendar
                className="size-5 cursor-pointer text-[#ADAAAA]"
                onClick={() => toInputRef.current?.showPicker()}
              />
            </div>
          </div>

          <CurrencySelect
            currencies={currencies}
            keyBy="_id"
            value={draft.currencyId}
            onChange={(value) => update("currencyId", value)}
            includeAllOption
          />

          <Select
            className="py-3"
            value={draft.type}
            onChange={(e) =>
              update("type", e.target.value as ReportsFilterValues["type"])
            }
            options={[
              { label: "All Types", value: "all" },
              { label: "Income", value: "income" },
              { label: "Expenses", value: "expense" },
            ]}
          />

          <PeriodSelector
            onPeriodChange={onPeriodChange}
            defaultPeriod={defaultPeriod}
            bare
          />

          <div className="flex items-center gap-4 ml-auto mr-8">
            <Button
              onClick={handleReset}
              className="flex justify-center items-center bg-[#262626] p-2 px-3 text-[#ADAAAA] font-medium rounded-lg hover:bg-[#323232] transition-colors duration-300"
            >
              Reset
            </Button>

            <Button
              onClick={handleApply}
              className="flex justify-center gap-2 items-center bg-landing-primary p-2 pr-0.5 pl-3 text-[#02381a] font-semibold rounded-lg shadow-xl hover:bg-landing-primary/80 transition-colors duration-300"
            >
              Apply
              <Search className="size-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
