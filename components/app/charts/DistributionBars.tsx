"use client";

import { CASHFLOW_PALETTE } from "@/components/app/charts/PieChart";

type Item = { name: string; value: number };

export interface DistributionBarsProps {
  data: Item[];
}

export function DistributionBars({ data }: DistributionBarsProps) {
  if (data.length === 0) {
    return (
      <p className="text-[#ADAAAA] text-sm text-center">
        No wallet data to display yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {data.map((item, i) => (
        <div key={item.name} className="flex flex-col gap-1.5 w-full">
          <div className="flex justify-between items-center text-sm gap-2">
            <span className="text-white/90 font-medium truncate">{item.name}</span>
            <span className="text-[#ADAAAA] shrink-0">{Math.round(item.value)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${item.value}%`,
                backgroundColor: CASHFLOW_PALETTE[i % CASHFLOW_PALETTE.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
