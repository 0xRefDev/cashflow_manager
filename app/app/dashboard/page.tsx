"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { MainHeader } from "@/components/app/MainHeader";
import { WalletContainer } from "@/components/app/WalletContainer";
import { ReportsTable } from "@/components/app/ReportsTable";
import { Footer } from "@/components/app/Footer";
import { Button } from "@/components/Button";

import { useAuthStore } from "@/store/useAuthStore";
import { Bell } from "@/icons/app/Bell";
import { Help } from "@/icons/Help";
import { ForwardArrow } from "@/icons/ForwardArrow";
import { Contract } from "@/icons/app/Contract";
import { ExpandIcon } from "@/icons/app/ExpandIcon";

import { walletService } from "@/services/client/wallet.services";
import { reportsService } from "@/services/client/reports.services";
import { Wallet } from "@/types/wallet.types";
import { TransactionsData } from "@/types/report.types";
import { usePreferences } from "@/hooks/usePreferences";

export default function Dashboard() {
  const { formatAmount } = usePreferences();

  const [topWallets, setTopWallets] = useState<Wallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [recentlyMovements, setRecentlyMovements] = useState<TransactionsData>({ transactions: [] });
  const [movementsLoading, setMovementsLoading] = useState(true);
  const [walletsExpanded, setWalletsExpanded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("walletsExpanded");
    if (stored !== null) {
      setWalletsExpanded(stored === "true");
    }
    setIsHydrated(true);
  }, []);

  const toggleWalletsExpanded = () => {
    setWalletsExpanded((prev) => {
      const nextValue = !prev;
      localStorage.setItem("walletsExpanded", String(nextValue));
      return nextValue;
    });
  };

  useEffect(() => {
    walletService.topWallets()
      .then((wallets) => {
        setTopWallets(wallets);
      }).catch((error) => {
        console.error("Error to get main wallets:", error);
      }).finally(() => setWalletsLoading(false));
  }, []);

  useEffect(() => {
    reportsService.recentlyMovements()
      .then((transactions) => {
        setRecentlyMovements(transactions);
      }).catch((error) => {
        console.error("Error to get recently movements:", error);
      }).finally(() => setMovementsLoading(false));
  }, []);

  const router = useRouter();
  const headerOptions = [
    {
      label: <Bell className="w-6 h-6" />,
      action: () => router.push("/app/notifications")
    },
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help")
    }
  ];

  const profile = useAuthStore((s) => s.profile);

  return (
    <section className="flex flex-col gap-0 min-h-screen text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Welcome back,{" "}
              <span className="text-landing-primary">{profile?.fullname ?? "—"}!</span>
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="p-4 h-full">
        <header className="px-4">
          <h1 className="uppercase font-semibold text-landing-primary text-[12px] mb-1 font-inter tracking-wider">Financial Snapshot</h1>
          <h2 className="text-4xl font-semibold text-white 2xl:w-120">Precision oversight for your global assets.</h2>
        </header>

        <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
          <section className="flex flex-wrap gap-4 py-8 max-w-275 px-4 items-start">
            {walletsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  width={walletsExpanded ? 320 : 280}
                  height={walletsExpanded ? 365 : 160}
                  borderRadius={16}
                />
              ))
            ) : (
              <AnimatePresence mode="wait">
                {topWallets.length > 0 ? (
                  topWallets.map((wallet) => (
                    <motion.div
                      key={wallet._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        width: walletsExpanded ? "20rem" : "280px",
                        height: walletsExpanded ? "365px" : "160px"
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <WalletContainer
                        wallet={wallet}
                        miniComponent={!walletsExpanded}
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center">No wallets found</p>
                )}
              </AnimatePresence>
            )}
          </section>
        </SkeletonTheme>

        <Button
          onClick={toggleWalletsExpanded}
          className="fixed right-6 top-27 p-2 rounded-lg bg-[#1A1A1A] border border-white/5 hover:border-landing-primary/30 hover:bg-[#262626] transition-all duration-300 z-50 cursor-pointer"
          title={walletsExpanded ? "Collapse wallets" : "Expand wallets"}
        >
          {walletsExpanded ? (
            <div className="flex items-center gap-2 w-fit group">
              <p className="text-xs text-white/60 group-hover:text-landing-primary transition-colors duration-300">Contract wallets</p>
              <Contract className="w-5 h-5 text-white/60 group-hover:text-landing-primary transition-colors duration-300" />
            </div>
          ) : (
            <div className="flex items-center gap-2 w-fit group">
              <p className="text-xs text-white/60 group-hover:text-landing-primary transition-colors duration-300">Expand wallets</p>
              <ExpandIcon className="w-5 h-5 text-white/60 group-hover:text-landing-primary transition-colors duration-300" />
            </div>
          )}
        </Button>

        <section className="">
          <header className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-white/90">Last Movements</h3>
              <p className="text-white/70 text-sm">Real-time ledger of your recent activity</p>
            </div>
            <Link href={"/app/reports"} className="text-landing-primary font-semibold flex gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg shadow-2xl shadow-black/10 hover:bg-[#262626] transition-colors duration-300 ease-in-out border border-landing-primary/5 hover:border-landing-primary/10">
              View Full Report <ForwardArrow />
            </Link>
          </header>

          <article className="mt-6 rounded-lg overflow-hidden shadow-2xl shadow-black/20">
            <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
              {movementsLoading ? (
                <div className="flex flex-col gap-2 bg-[#131313] p-4">
                  {/* Header row */}
                  <div className="grid grid-cols-4 gap-4 pb-3">
                    {["Quantity", "Currency", "Description", "Date"].map((label) => (
                      <p key={label} className="text-xs uppercase tracking-wider text-white/40">
                        {label}
                      </p>
                    ))}
                  </div>
                  {/* Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-center py-2">
                      <Skeleton width="60%" height={14} />
                      <Skeleton width="50%" height={14} />
                      <Skeleton width="80%" height={14} />
                      <Skeleton width="50%" height={14} />
                    </div>
                  ))}
                </div>
              ) : (
                <ReportsTable
                  reports={recentlyMovements.transactions}
                  headers={[
                    { label: "Quantity" },
                    { label: "Currency" },
                    { label: "Description" },
                    { label: "Date" }
                  ]}
                  formatAmount={formatAmount}
                />
              )}
            </SkeletonTheme>
          </article>
        </section>

      </article>
      <Footer />
    </section>
  );
}