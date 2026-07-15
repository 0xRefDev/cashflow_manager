"use client";

import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MainHeader } from "@/components/app/MainHeader";
import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";
import { PieChart } from "@/components/app/charts/PieChart";
import { DistributionBars } from "@/components/app/charts/DistributionBars";
import { CreateWalletModal } from "@/components/app/CreateWalletModal";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";

import { Help } from "@/icons/Help";
import { Bell } from "@/icons/app/Bell";
import { Add } from "@/icons/app/Add";
import { Download } from "@/icons/app/Download";
import { Edit } from "@/icons/app/Edit";
import { Trash } from "@/icons/app/Trash";

import { walletService } from "@/services/client/wallet.services";
import { Wallet } from "@/types/wallet.types";

export default function Page() {
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = useState<Wallet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const walletDistribution = wallets.map((wallet) => ({
    name: wallet.name,
    value: totalBalance > 0 ? (wallet.balance / totalBalance) * 100 : 0,
  }));

  useEffect(() => {
    walletService
      .getAll()
      .then(setWallets)
      .catch((error) => console.error("Error to get wallets:", error))
      .finally(() => setIsLoading(false));
  }, []);

  function handleWalletSaved(saved: Wallet) {
    setWallets((prev) =>
      prev.some((w) => w._id === saved._id)
        ? prev.map((w) => (w._id === saved._id ? saved : w))
        : [...prev, saved],
    );
  }

  function closeWalletModal() {
    setIsModalOpen(false);
    setEditingWallet(null);
  }

  async function handleConfirmDelete() {
    if (!deletingWallet) return;
    setIsDeleting(true);
    try {
      await walletService.remove(deletingWallet._id);
      setWallets((prev) => prev.filter((w) => w._id !== deletingWallet._id));
      setDeletingWallet(null);
    } catch (error) {
      console.error("Error deleting wallet:", error);
    } finally {
      setIsDeleting(false);
    }
  }

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
              Manage your wallets
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="flex p-12">
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-3xl font-semibold text-white/90">
            Wallets Management
          </h2>
          <p className="text-[#ADAAAA] text-lg max-w-1/2">
            Summary of your assets and specialized accounts, and basic
            statistics for your wallets.
          </p>
        </div>
        <div className="flex gap-4 items-end justify-center">
          <Button
            className="flex gap-2 px-4 py-3 rounded-xl bg-[#20201F] text-white font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={true}
          >
            <Download className="w-6 h-6" /> Export data
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 px-4 py-3 rounded-xl bg-landing-primary text-[#014b24] font-medium whitespace-nowrap"
          >
            <Add className="w-6 h-6" /> New Wallet
          </Button>
        </div>
      </article>

      <SkeletonTheme baseColor="#202020" highlightColor="#2c2c2c">
        <section className="w-full grid-cols-3 grid gap-4 p-12 pt-0">
          {/* Graphics */}
          <article className="bg-[#131313] h-[70dvh] col-span-2 rounded-2xl p-8 relative overflow">
            <div className="absolute -right-30 top-0 size-75 bg-[#6E9BFF]/13 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute left-[20%] bottom-[50%] size-37.5 bg-landing-primary/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute right-[25%] bottom-[10%] size-25 bg-landing-primary/8 blur-2xl rounded-full pointer-events-none" />
            <div>
              <h2 className="text-xl font-semibold">
                Assets Distribution Overview
              </h2>
              <p className="text-md text-[#ADAAAA]">
                Visualize your assets on a real-time chart
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 gap-6">
              {isLoading ? (
                <>
                  <Skeleton circle width={260} height={260} />
                  <div className="bg-white/6 w-full h-full flex flex-col justify-center gap-3 px-4 py-6 rounded-xl backdrop-blur-xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <Skeleton width="40%" height={12} />
                        <Skeleton height={10} borderRadius={6} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <PieChart data={walletDistribution} total={totalBalance} />
                  <div className="bg-white/6 w-full h-full flex flex-col justify-center px-4 py-6 rounded-xl backdrop-blur-xl">
                    <DistributionBars data={walletDistribution} />
                  </div>
                </>
              )}
            </div>
          </article>

          <article className="bg-[#131313] h-[70dvh] col-span-1 rounded-2xl p-6 overflow-auto">
            <h2 className="text-xl">My Wallets</h2>
            <div
              className={`flex flex-col gap-3 items-center ${
                !isLoading && wallets.length === 0
                  ? "justify-center h-[55dvh] mt-0"
                  : "mt-4"
              }`}
            >
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#20201F]/40 border border-landing-primary/15 p-4 rounded-lg w-full flex items-center justify-between backdrop-blur-lg"
                  >
                    <div className="flex flex-col gap-1.5 w-1/2">
                      <Skeleton width="70%" height={16} />
                      <Skeleton width="40%" height={12} />
                    </div>
                    <Skeleton width={70} height={16} />
                  </div>
                ))
              ) : wallets.length === 0 ? (
                <p className="text-[#ADAAAA] text-lg text-center">
                  You have no wallets yet. <br />{" "}
                  <span className="text-landing-primary/85">
                    Create a new wallet to get started.
                  </span>
                </p>
              ) : (
                wallets.map((wallet) => (
                  <div
                    key={wallet._id}
                    className={`group bg-[#20201F]/40 border border-landing-primary/15 p-4 rounded-lg w-full flex items-center justify-between backdrop-blur-lg`}
                  >
                    <div className="flex flex-col">
                      <h3 className="text-base font-semibold text-white/90">
                        {wallet.name}
                      </h3>
                      <p className="text-[#ADAAAA] text-sm">
                        {wallet.currencyId.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-landing-primary font-semibold">
                        {wallet.currencyId.symbol}
                        {wallet.balance.toLocaleString("en-US")}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWallet(wallet);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-[#ADAAAA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingWallet(wallet)}
                          className="p-1.5 rounded-md text-[#ADAAAA] hover:text-[#FF4938] hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </SkeletonTheme>

      <CreateWalletModal
        open={isModalOpen}
        wallet={editingWallet}
        onClose={closeWalletModal}
        onSaved={handleWalletSaved}
      />

      <ConfirmDialog
        open={deletingWallet !== null}
        title="Delete Wallet"
        description={`Are you sure you want to delete "${deletingWallet?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingWallet(null)}
      />
    </section>
  );
}