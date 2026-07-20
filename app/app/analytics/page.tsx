"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { MainHeader } from "@/components/app/MainHeader";
import { Button } from "@/components/Button";
import { InfoCard } from "@/components/app/InfoCard";
import { Help } from "@/icons/Help";
import { Wallet } from "@/icons/Wallet";

import { analyticsService } from "@/services/client/analytics.services";
import { AnalyticsChart, type Sale } from "@/components/app/AnalyticsChart";

export default function Analytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    total_savings: number;
    growth_annual: number;
    growth_monthly: number;
    growth_daily: number;
  } | null>(null);
  const [chartData, setChartData] = useState<Sale[]>([]);
  const [period, setPeriod] = useState<"30d" | "6m" | "1y">("30d");

  const headerOptions = [
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];

  const periodOptions = [
    { value: "30d", label: "30 Days" },
    { value: "6m", label: "6 Months" },
    { value: "1y", label: "1 Year" },
  ];

  const fetchSummary = useCallback(async () => {
    try {
      const data = await analyticsService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  }, []);

  const fetchChart = useCallback(async () => {
    try {
      const res = await analyticsService.getChartData(period);
      setChartData(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  }, [period]);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchSummary();
      await fetchChart();
      setLoading(false);
    };
    fetchAll();
  }, [fetchSummary, , fetchChart]);

  if (loading) {
    return (
      <section className="flex flex-col gap-0 min-h-screen text-white">
        <MainHeader
          title={
            <div className="flex items-center gap-2">
              <p className="text-xl sm:text-2xl font-semibold text-white/90">
                Analytics{" "}
                <span className="text-landing-primary"> | Overview</span>
              </p>
            </div>
          }
          options={headerOptions}
        />

        <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
          <article className="p-12 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
            <section className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-8 w-48 rounded" />
                <Skeleton className="h-10 w-40 rounded-md" />
              </div>
              <Skeleton className="w-full h-100 rounded-xl" />
            </section>
            <section className="mt-12 flex flex-col">
              <Skeleton className="h-8 w-48 rounded mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
              </div>
            </section>
          </article>
        </SkeletonTheme>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-0 min-h-screen text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Analytics{" "}
              <span className="text-landing-primary"> | Overview</span>
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="p-12 h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard
            title="Total Savings"
            total={summary?.total_savings ?? 0}
            icon={<Wallet className="w-4 h-4 text-landing-primary/70" />}
            variant="income"
            subtitle={`${summary?.growth_annual ? `${summary.growth_annual > 0 ? "+" : ""}${summary.growth_annual}% YoY` : "—"}`}
          />
          {/* <InfoCard
            title="Monthly Growth"
            total={`${summary?.growth_monthly ?? 0}%`}
            icon={<Sparks className="w-6 h-6 text-[#6E9BFF]" />}
            variant="income"
            subtitle={`${summary?.growth_daily ?? 0}% Today`}
          />
          <InfoCard
            title="Daily Growth"
            total={`${summary?.growth_daily ?? 0}%`}
            icon={<Sparks className="w-6 h-6 text-[#FF7351]" />}
            variant="expense"
            subtitle="vs yesterday"
          /> */}
        </div>

        <section className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Wealth Evolution</h2>
            <div className="flex gap-2">
              {periodOptions.map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value as "30d" | "6m" | "1y")}
                  className={`transition-colors duration-300 px-4 py-2 rounded-lg text-sm ${
                    period === opt.value
                      ? "bg-landing-primary text-black"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="w-full h-100 rounded-xl bg-[#111] border border-white/10 p-6">
            <AnalyticsChart points={chartData} />
          </div>
        </section>   
      </article>
    </section>
  );
}