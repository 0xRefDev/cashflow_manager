import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";

import { Calendar } from "@/icons/app/Calendar";
import { Search } from "@/icons/app/Search";
import { Download } from "@/icons/app/Download";

import { Currency } from "@/types/currencies.types";
import { currencyService } from "@/services/client/currencies.services";

function getFormattedDateRange(): string {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  return `${month} 01 - ${month} ${lastDay}, ${year}`;
}

export function ReportsFilter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [dateDisplay, setDateDisplay] = useState<string>(getFormattedDateRange());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!raw) return;

    const date = new Date(raw + "T00:00:00");
    const formatted = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

    setSelectedDate(raw);
    setDateDisplay(formatted);
  }

  return (
    <>
      <article className="p-4 rounded-lg rounded-bl-none bg-[#131313]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 relative">
            <Search className="absolute left-3" />
            <Input
              placeholder="Search by name, category, or amount"
              type="text"
              name="search"
              id="search"
              className="py-3 pl-10"
            />
          </div>
          <div className="flex relative items-center gap-2 bg-black p-1.5 rounded-lg">
            <label
              htmlFor="date-range"
              className="bg-[#262626] p-1.5 rounded-md whitespace-nowrap"
            >
              Date Range
            </label>
            <span className="bg-[#ADAAAA]/20 absolute left-27 w-0.5 h-6 rounded-full"></span>
            <div className="relative flex items-center gap-6 px-2">
              <input
                ref={dateInputRef}
                type="date"
                id="date-range"
                value={selectedDate}
                onChange={handleDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <span className="text-[#ADAAAA] text-sm whitespace-nowrap">
                {dateDisplay}
              </span>
              <Calendar
                className="size-5 cursor-pointer text-[#ADAAAA]"
                onClick={() => dateInputRef.current?.showPicker()}
              />
            </div>
          </div>

          <Select
            className="py-3"
            options={currencies.map((currency) => ({
              label: `${currency.name}`,
              value: String(currency._id),
            }))}
          />

          <Select
            className="py-3"
            options={[
              { label: "All Types", value: "all" },
              { label: "Income", value: "income" },
              { label: "Expenses", value: "expense" },
            ]}
          />

          <Button className="flex justify-center items-center ml-auto bg-landing-primary p-2 px-3 text-[#02381a] font-semibold rounded-lg shadow-xl hover:bg-landing-primary/80 transition-colors duration-300">
            <Download className="size-5 mr-2" />
            Export PDF
          </Button>
        </div>
      </article>
    </>
  );
}