"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

import { MainHeader } from "@/components/app/MainHeader";
import {
  ReportsFilter,
  ReportsFilterValues,
} from "@/components/app/ReportsFilter";
import { InfoCard } from "@/components/app/InfoCard";
import { ReportsTable } from "@/components/app/ReportsTable";
import { Pagination } from "@/components/app/Pagination";
import { ReportPdfTemplate } from "@/components/app/ReportPdfTemplate";
import { Button } from "@/components/Button";
import { exportElementToPdf } from "@/components/app/helpers/exportReportPdf";

import { Help } from "@/icons/Help";
import { Download } from "@/icons/app/Download";
import { Bell } from "@/icons/app/Bell";
import { GrowIndicator } from "@/icons/app/GrowIndicator";
import { DecreaseIndicator } from "@/icons/app/DecreaseIndicator";
import { Account } from "@/icons/app/Account";

import {
  ReportsData,
  Movement,
  SummaryReport,
  ReportFilters,
} from "@/types/report.types";
import { transactionService } from "@/services/client/reports.services";

const LIMIT = 7;

type Period = "week" | "month" | "quarter" | "year" | "";

const EMPTY_BAR_FILTERS: ReportsFilterValues = {
  search: "",
  currencyId: "",
  type: "all",
  from: "",
  to: "",
};

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [barFilters, setBarFilters] =
    useState<ReportsFilterValues>(EMPTY_BAR_FILTERS);
  const [movements, setMovements] = useState<ReportsData>({
    data: [],
    pagination: { page: 0, limit: LIMIT, total: 0, pages: 1 },
  });
  const [movementsLoading, setMovementsLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryReport>({
    income: { quantity: 0, percentage: 0 },
    expenses: { quantity: 0, percentage: 0 },
    net_balance: 0,
    baseCurrency: "USD",
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMovements, setExportMovements] = useState<Movement[] | null>(null);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const filters: ReportFilters = {
    period: selectedPeriod,
    type: barFilters.type,
    currencyId: barFilters.currencyId,
    search: barFilters.search,
    from: barFilters.from,
    to: barFilters.to,
  };

  useEffect(() => {
    setMovementsLoading(true);
    transactionService
      .movements(currentPage, LIMIT, filters)
      .then((transactions) => {
        setMovements(transactions);
      })
      .catch((error) => console.error("Error to get movements:", error))
      .finally(() => setMovementsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedPeriod, barFilters]);

  useEffect(() => {
    setSummaryLoading(true);
    transactionService
      .summary(filters)
      .then((data) => {
        setSummary(data);
      })
      .catch((error) => console.error("Error to get summary report:", error))
      .finally(() => setSummaryLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, barFilters]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
  };

  const handleApplyFilters = (values: ReportsFilterValues) => {
    setBarFilters(values);
    setCurrentPage(1);
  };

  const waitForNextPaint = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const allMovements = await transactionService.movementsAll(filters);
      setExportMovements(allMovements ?? []);
      await waitForNextPaint();

      if (pdfTemplateRef.current) {
        const period = selectedPeriod || "all";
        const dateStamp = new Date().toISOString().slice(0, 10);
        await exportElementToPdf(
          pdfTemplateRef.current,
          `CashFlow-Report-${period}-${dateStamp}.pdf`,
        );
      }
    } catch (error) {
      console.error("Error exporting report to PDF:", error);
    } finally {
      setExportMovements(null);
      setIsExporting(false);
    }
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
      subtitle: `Selected Period (${summary.baseCurrency})`,
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

        <ReportsFilter
          onApply={handleApplyFilters}
          onPeriodChange={handlePeriodChange}
          defaultPeriod={"month"}
        />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              total={card.total}
              variant={card.variant}
              isLoading={summaryLoading}
            />
          ))}
        </section>

        <article className="relative mt-6 rounded-lg overflow-hidden shadow-2xl shadow-black/20">
          <ReportsTable
            reports={movements.data}
            isLoading={movementsLoading}
            skeletonRows={LIMIT}
            headers={[
              { label: "Quantity" },
              { label: "Currency" },
              { label: "Description" },
              { label: "Date" },
            ]}
          />

          <Button
            onClick={handleExportPdf}
            disabled={isExporting || movementsLoading}
            className="absolute bottom-2.5 flex justify-center items-center bg-landing-primary p-2 px-3 text-[#005D2C] font-medium rounded-lg hover:bg-landing-primary/80 transition-colors duration-300 ml-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download className="size-5 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>

          <Pagination
            currentPage={currentPage}
            totalPages={movements.pagination?.pages ?? 1}
            onPageChange={setCurrentPage}
            isLoading={movementsLoading}
          />
        </article>
      </article>

      {exportMovements && (
        <div
          className="fixed top-0 pointer-events-none"
          style={{ left: "-10000px" }}
          aria-hidden="true"
        >
          <div ref={pdfTemplateRef}>
            <ReportPdfTemplate
              movements={exportMovements}
              summary={summary}
              filters={filters}
              generatedAt={new Date()}
            />
          </div>
        </div>
      )}
    </section>
  );
}