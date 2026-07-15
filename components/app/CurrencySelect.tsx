"use client";

import { useEffect, useRef, useState } from "react";

import { Currency } from "@/types/currencies.types";
import { getCurrencyIcon, getCurrencyName } from "@/utils/Currencies";

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  currencies: Currency[];
  keyBy?: "_id" | "name";
  placeholder?: string;
  includeAllOption?: boolean;
  className?: string;
}

export function CurrencySelect({
  value,
  onChange,
  currencies,
  keyBy = "_id",
  placeholder = "Select currency",
  includeAllOption = false,
  className = "",
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOptionKey = (currency: Currency) =>
    keyBy === "_id" ? String(currency._id) : currency.name;

  const selected = currencies.find((c) => getOptionKey(c) === value);
  const SelectedIcon = selected ? getCurrencyIcon(selected.name) : null;

  const handleSelect = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-2 bg-[#111111] border border-white/5 rounded-xl py-2 pl-4 pr-10 text-white outline-none hover:border-white/10 focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all duration-300 font-inter ${className}`}
      >
        {selected ? (
          <>
            {SelectedIcon && (
              <span className="flex items-center justify-center bg-[#20201F] p-1 rounded-lg">
                <SelectedIcon className="size-4" />
              </span>
            )}
            <span className="truncate">
              {selected.name} — {getCurrencyName(selected.name)}
            </span>
          </>
        ) : (
          <span className="text-gray-500">
            {includeAllOption ? "All Currencies" : placeholder}
          </span>
        )}
      </button>

      <svg
        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#ADAAAA] size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {open && (
        <ul className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-[#111111] border border-white/5 rounded-xl shadow-2xl shadow-black/40 py-1">
          {includeAllOption && (
            <li>
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors duration-150 ${
                  value === "" ? "text-[#4ade80]" : "text-white"
                }`}
              >
                All Currencies
              </button>
            </li>
          )}

          {currencies.map((currency) => {
            const key = getOptionKey(currency);
            const Icon = getCurrencyIcon(currency.name);

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors duration-150 ${
                    value === key ? "text-[#4ade80]" : "text-white"
                  }`}
                >
                  {Icon && (
                    <span className="flex items-center justify-center bg-[#20201F] p-1 rounded-lg">
                      <Icon className="size-4" />
                    </span>
                  )}
                  <span className="truncate">
                    {currency.name} — {getCurrencyName(currency.name)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
