import { SlotText } from "slot-text/react";
import "slot-text/style.css";

export function AnalyticsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="w-83 bg-[#1E1E1E] rounded-lg p-6 flex flex-col gap-4">
      <p className="text-sm text-white/70">{title}</p>
      <p className="text-2xl font-semibold text-white">
        <SlotText text={value ? `${value}` : "0.00"} />
      </p>
    </div>
  );
}
