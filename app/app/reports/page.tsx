"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { MainHeader } from "@/components/app/MainHeader";
import { PeriodSelector } from "@/components/app/PeriodSelector";
import { ReportsFilter } from "@/components/app/ReportsFilter";
import { InfoCard } from "@/components/app/InfoCard";
import { ReportsTable } from "@/components/app/ReportsTable";
import { Pagination } from "@/components/app/Pagination";

import { Help } from "@/icons/Help";
import { Bell } from "@/icons/app/Bell";
import { GrowIndicator } from "@/icons/app/GrowIndicator";
import { DecreaseIndicator } from "@/icons/app/DecreaseIndicator";
import { Account } from "@/icons/app/Account";

import { ReportsData, SummaryReport } from "@/types/report.types";
import { transactionService } from "@/services/client/reports.services";

const LIMIT = 7;

type Period = "week" | "month" | "quarter" | "year" | "";

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [movements, setMovements] = useState<ReportsData>({
    data: [],
    pagination: { page: 0, limit: LIMIT, total: 0, pages: 1 },
  });
  const [summary, setSummary] = useState<SummaryReport>({
    income: { quantity: 0, percentage: 0 },
    expenses: { quantity: 0, percentage: 0 },
    net_balance: 0,
  });

  useEffect(() => {
    transactionService
      .movements(currentPage, LIMIT)
      .then((transactions) => {
        setMovements(transactions);
      })
      .catch((error) => console.error("Error to get movements:", error));
  }, [currentPage]);

  useEffect(() => {
    transactionService
      .summary(selectedPeriod)
      .then((data) => {
        setSummary(data);
      })
      .catch((error) => console.error("Error to get summary report:", error));
  }, [selectedPeriod]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
  };

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

  const infoCards = [
    {
      title: "Total Incomes",
      subtitle: `${summary.income.percentage.toFixed(2)}%`,
      icon: <GrowIndicator className="w-5 h-5" />,
      total: summary.income.quantity.toFixed(2) ?? 0,
      variant: "income" as const,
    },
    {
      title: "Total Expenses",
      subtitle: `${summary.expenses.percentage.toFixed(2)}%`,
      icon: <DecreaseIndicator className="w-5 h-5" />,
      total: summary.expenses.quantity.toFixed(2) ?? 0,
      variant: "expense" as const,
    },
    {
      title: "Net Balance",
      subtitle: "Selected Period",
      icon: <Account className="w-5 h-5" />,
      total: summary.net_balance.toFixed(2) ?? 0,
      variant: "net" as const,
    },
  ];

  return (
    <section className="h-full text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Financial Reports
            </p>
          </div>
        }
        options={headerOptions}
      />
      <article className="p-6 px-14 mt-4 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-white/90">
            Your financial reports is here
          </h2>
          <p className="text-[#ADAAAA] text-lg max-w-132 mt-1">
            Detailed ledger and transaction analysis. Monitor your capital flow
            with surgical precision.
          </p>
        </div>
        
        <div className="flex items-center justify-between flex-wrap">
          <ReportsFilter />
          <PeriodSelector onPeriodChange={handlePeriodChange} defaultPeriod={"month"} />
        </div>
        
        
        {/* Info Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              total={card.total}
              variant={card.variant}
            />
          ))}
        </section>
        
        {/* Reports Table */}
        <article className="mt-6 rounded-lg overflow-hidden shadow-2xl shadow-black/20">
          <ReportsTable
            reports={movements.data}
            headers={[
              { label: "Quantity" },
              { label: "Currency" },
              { label: "Description" },
              { label: "Date" },
            ]}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={movements.pagination?.pages ?? 1}
            onPageChange={setCurrentPage}
          />
        </article>
      </article>
    </section>
  );
}