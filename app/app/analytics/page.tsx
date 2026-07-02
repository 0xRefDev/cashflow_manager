"use client";

import { MainHeader } from "@/components/app/MainHeader";
import { useRouter } from "next/navigation";

import { Help } from "@/icons/Help";
import { Bell } from "@/icons/app/Bell";

import { Select } from "@/components/Select";
import { AnalyticsCard } from "@/components/app/AnalyticsCard";
import { AnalyticsChart } from "@/components/app/AnalyticsChart";

export default function Page() {
  const router = useRouter();

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
  return (
    <section className="h-full text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Analytics
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="p-6 px-14 mt-4 flex flex-col gap-6">
        {/* Title, Year and Currency Selectors */}
        <article className="flex max-w-5xl">
          <div className="flex flex-col gap-2">
            <h2 className="text-5xl font-semibold text-white/90 font-manrope">
              Saving Stats
            </h2>
            <p className="text-[#ADAAAA] text-lg max-w-132 mt-1">
              Advanced metrics and temporal analysis of your wealth accumulation
              for the year.
            </p>
          </div>
          <div className="ml-auto flex items-end gap-4">
            <Select
              options={[
                { label: "USD ($)", value: "2024" },
                { label: "2023", value: "2023" },
                { label: "2022", value: "2022" },
              ]}
              defaultValue="2024"
              onChange={(value) => {
                console.log("Selected year:", value);
              }}
            />
          </div>
        </article>

        {/* Pasar data de la DB a los cards */}
        <section className="flex justify-between items-center max-w-5xl">
          <AnalyticsCard title="Total Savings" value="$0.00" />
          <AnalyticsCard title="Monthly Growth %" value="$0.00" />
          <AnalyticsCard title="Avg Daily Balance" value="$0.00" />
        </section>

        <section className="h-120 w-full max-w-480 rounded-xl border-[#1F1F1F] border-2 p-0.75">
          <article className="bg-[#131313] h-full w-full rounded-lg relative overflow-hidden pt-8">
            {/* Glow Light */}
            <div className="absolute right-80 -top-50 size-80 bg-landing-primary/25 blur-[10rem] rounded-full pointer-events-none" />
            {/*  */}
            <div className="px-6 mb-2 h-[10%]">
              <h2 className="text-2xl font-bold text-white">Wealth Evolution</h2>
              <p className="text-[#ADAAAA]">Organic growth of assets across accounts</p>
            </div>

            <article className="flex justify-center items-end w-full h-[88%] relative">
              <AnalyticsChart />
              <div className="z-1 absolute bottom-0 left-0 w-full h-[88%] flex flex-col justify-between px-10">
                <div className="w-full h-px bg-[#48484763]" />
                <div className="w-full h-px bg-[#48484763]" />
                <div className="w-full h-px bg-[#48484763]" />
                <div className="w-full h-px bg-transparent" />
              </div>
            </article>

          </article>
        </section>
      </article>
    </section>
  );
}
