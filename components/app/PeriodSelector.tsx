"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export type Period = "week" | "month" | "quarter" | "year" | "";

interface PeriodSelectorProps {
  onPeriodChange: (period: Period) => void;
  defaultPeriod?: Period;
  bare?: boolean;
}

const periods: { label: string; value: Period; description: string, styles?: string }[] = [
  { label: "All Time", value: "", description: "Complete history", styles: "mr-3" },
  { label: "Week", value: "week", description: "Last 7 days", styles: "" },
  { label: "Month", value: "month", description: "Current month", styles: "" },
  { label: "Quarter", value: "quarter", description: "Current quarter", styles: "" },
  { label: "Year", value: "year", description: "Current year", styles: "" },
];

export function PeriodSelector({ onPeriodChange, defaultPeriod = "month", bare = false }: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(defaultPeriod);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  const content = (
    <div className="ml-2 flex items-center gap-3 flex-wrap">
      <span className="text-[#ADAAAA] text-sm font-medium uppercase tracking-wide">
        Period:
      </span>
      <div className="flex gap-2 flex-wrap">
        {periods.map((period) => (
          <Button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              selectedPeriod === period.value
                ? "bg-landing-primary text-[#02381a] shadow-md shadow-landing-primary/2"
                : "bg-[#262626] text-[#ADAAAA] hover:bg-[#323232] outline-1 outline-[#484847]/30 hover:outline-[#484847]/60"
            } ${period.styles || ''}`}
            title={period.description}
          >
            {period.label}
          </Button>
        ))}
      </div>
    </div>
  );

  if (bare) return content;

  return (
    <article className="p-4 py-5.5 bg-[#131313] rounded-bl rounded-br">
      {content}
    </article>
  );
}