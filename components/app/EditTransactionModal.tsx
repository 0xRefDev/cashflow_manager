"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sileo } from "sileo";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Cash } from "@/icons/Cash";
import { Calendar } from "@/icons/app/Calendar";
import { Add } from "@/icons/app/Add";
import { Cancel } from "@/icons/Cancel";
import { Edit } from "@/icons/app/Edit";

import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";

import { transactionService } from "@/services/client/transaction.services";
import { walletCurrencyService } from "@/services/client/wallet-currency.services";
import { WalletOption } from "@/types/wallet.types";
import { TRANSACTION_CATEGORIES } from "@/lib/schemas";
import { safeAdd, safeSubtract } from "@/utils/math";

const transactionSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  quantity: z.number().positive("Amount must be greater than 0"),
  description: z.string().trim().max(500).optional(),
  date: z.string().min(1, "Date is required"),
  category: z.enum(TRANSACTION_CATEGORIES).optional(),
});

export type FormValues = z.infer<typeof transactionSchema>;

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: {
    _id: string;
    title: string;
    quantity: number;
    description?: string;
    date: string;
    type: "income" | "expense";
    category?: string;
    walletId: {
      _id: string;
      name: string;
      currencyId: { name: string; symbol: string };
    };
  } | null;
  onSuccess: () => void;
}

export function EditTransactionModal({
  open,
  onClose,
  transaction,
  onSuccess,
}: EditTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
  });

  function showError(title: string, description: string) {
    sileo.error({
      title,
      description: <span className="text-center">{description}</span>,
      fill: "black",
      styles: {
        title: "text-white!",
        description: "text-white/75!",
        badge: "bg-white/5!",
      },
    });
  }

  function showSuccess(description: string) {
    sileo.success({
      title: "Transaction Updated",
      description: <span className="text-center">{description}</span>,
      fill: "black",
      styles: {
        title: "text-white!",
        description: "text-white/75!",
        badge: "bg-white/5!",
      },
    });
  }

  function onInvalid() {
    showError("Missing Information", "Please fill in all required fields.");
  }

  useEffect(() => {
    walletCurrencyService
      .getUserWallets()
      .then(setWallets)
      .catch(console.error)
      .finally(() => setWalletsLoading(false));
  }, []);

  useEffect(() => {
    if (transaction && open) {
      setTransactionType(transaction.type);
      setSelectedWallet(transaction.walletId._id);

      reset({
        title: transaction.title,
        quantity: transaction.quantity,
        description: transaction.description || "",
        date: transaction.date.split("T")[0],
        category: transaction.category
          ? (transaction.category as (typeof TRANSACTION_CATEGORIES)[number])
          : undefined,
      });
    }
  }, [transaction, open, reset]);

  async function onSubmit(values: FormValues) {
    if (!selectedWallet || !transaction) return;
    setIsSubmitting(true);
    try {
      await transactionService.update(transaction._id, {
        ...values,
        walletId: selectedWallet,
        type: transactionType,
      });
      showSuccess("Your movement has been updated successfully.");
      onSuccess();
      onClose();
    } catch (err) {
      showError(
        "Update Failed",
        err instanceof Error
          ? err.message
          : "Could not update the transaction.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const quantityValue = watch("quantity");
  const amount = typeof quantityValue === "number" && !isNaN(quantityValue) ? quantityValue : 0;
  const activeWallet = wallets.find((w) => w.walletId === selectedWallet);
  const currentBalance = activeWallet ? activeWallet.balance : 0;
  const symbol = activeWallet ? activeWallet.symbol : "$";
  const newBalance =
    transactionType === "income"
      ? safeAdd(currentBalance, amount)
      : safeSubtract(currentBalance, amount);

  const formatValue = (val: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);

  const isIncome = transactionType === "income";

  if (!open || !transaction) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-lg bg-[#131313] border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-landing-primary" />
              <h2 className="text-lg font-semibold text-white">Edit Transaction</h2>
            </div>
            <Button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              <Cancel className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="flex flex-col gap-5 p-4 pb-6 max-h-[80vh] overflow-y-auto"
          >
            {/* Type Toggle */}
            <div className="flex relative rounded-xl overflow-hidden border border-white/5 bg-black">
              <Button
                type="button"
                onClick={() => setTransactionType("income")}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-300 relative ${
                  isIncome ? "text-[#033e1f]" : "text-[#ADAAAA] hover:text-white/70"
                }`}
                disabled={isSubmitting}
              >
                {isIncome && (
                  <motion.div
                    layoutId="toggle-bg"
                    className="absolute inset-0 bg-landing-primary"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                <span className="relative z-10">↑ Income</span>
              </Button>
              <span className="absolute rounded-full z-9999 top-2 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-black"></span>
              <Button
                type="button"
                onClick={() => setTransactionType("expense")}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-300 relative ${
                  !isIncome ? "text-white" : "text-[#ADAAAA] hover:text-white/70"
                }`}
                disabled={isSubmitting}
              >
                {!isIncome && (
                  <motion.div
                    layoutId="toggle-bg"
                    className="absolute inset-0 bg-[#FF4F5F]"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                <span className="relative z-10">↓ Expense</span>
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-widest text-[#ADAAAA]/60 ml-1 mb-1">Details</p>
              <div className="flex gap-3">
                <div className="flex flex-col flex-1">
                  <label htmlFor="editTitle" className="text-[#ADAAAA] tracking-widest text-[9px] ml-1 mb-1 uppercase">Title</label>
                  <Input type="text" placeholder="Transaction title" id="editTitle" className="bg-black" {...register("title")} disabled={isSubmitting} />
                </div>
                <div className="flex flex-col relative">
                  <label htmlFor="editDate" className="text-[#ADAAAA] tracking-widest text-[9px] ml-1 mb-1 uppercase">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-landing-primary/50 pointer-events-none" />
                    <Input type="date" id="editDate" className="bg-black pl-10" {...register("date")} disabled={isSubmitting} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-widest text-[#ADAAAA]/60 ml-1 mb-1">Amount & Wallet</p>
              <div className="flex gap-3">
                <div className="flex flex-col flex-1 relative">
                  <label htmlFor="editAmount" className="text-[#ADAAAA] tracking-widest text-[9px] ml-1 mb-1 uppercase">Amount</label>
                  <div className="relative">
                    <Cash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-landing-primary/50 pointer-events-none" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      id="editAmount"
                      className={`pl-10 bg-black font-semibold transition-colors duration-200 ${isIncome ? "text-landing-primary" : "text-[#FF4F5F]"}`}
                      {...register("quantity", { valueAsNumber: true })}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <label htmlFor="editWallet" className="text-[#ADAAAA] tracking-widest text-[9px] ml-1 mb-1 uppercase">Wallet</label>
                  {walletsLoading ? (
                    <SkeletonTheme baseColor="#000000" highlightColor="#161616">
                      <Skeleton height={38} borderRadius={12} />
                    </SkeletonTheme>
                  ) : (
                    <Select
                      id="editWallet"
                      value={selectedWallet}
                      className="bg-black"
                      onChange={(e) => setSelectedWallet(e.target.value)}
                      options={[
                        { value: "", label: "Select wallet" },
                        ...wallets.map((w) => ({
                          value: w.walletId,
                          label: `(${w.symbol}) ${w.currency} - ${w.wallet}`,
                        })),
                      ]}
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="editCategory" className="text-[#ADAAAA] tracking-widest text-[9px] ml-1 mb-1 uppercase">Category</label>
              <Select
                id="editCategory"
                className="bg-black"
                options={[
                  { value: "", label: "Select category" },
                  ...TRANSACTION_CATEGORIES.map((cat) => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  })),
                ]}
                {...register("category")}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="editDescription" className="text-[#ADAAAA] tracking-widest text-[9px] ml-1 mb-1 uppercase">Description</label>
              <textarea
                id="editDescription"
                rows={2}
                className="bg-black border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm outline-none hover:border-white/10 focus:border-[#4ade80]/40 focus:ring-1 focus:ring-[#4ade80]/15 transition-all duration-300 resize-none placeholder:text-white/20"
                placeholder="Describe your transaction..."
                {...register("description")}
                disabled={isSubmitting}
              />
            </div>

            {selectedWallet && activeWallet && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 border border-white/5 border-l-2 bg-[#0e0e0e] ${isIncome ? "border-l-landing-primary/60" : "border-l-[#FF4F5F]/60"}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] uppercase tracking-widest text-[#ADAAAA]/60">Balance preview · {activeWallet.wallet}</span>
                  <span className={`text-sm font-bold ${isIncome ? "text-landing-primary" : "text-[#FF4F5F]"}`}>
                    {isIncome ? "+" : "-"}
                    {symbol}
                    {formatValue(amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[#ADAAAA]/60 mb-0.5">Current</p>
                    <p className="text-sm text-white/70 font-medium">{symbol}{formatValue(currentBalance)}</p>
                  </div>
                  <div className="text-[#ADAAAA]/30 text-sm">→</div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-[#ADAAAA]/60 mb-0.5">After</p>
                    <p className={`text-sm font-bold ${newBalance >= 0 ? "text-white" : "text-[#FF4F5F]"}`}>
                      {symbol}
                      {formatValue(newBalance)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={walletsLoading || isSubmitting}
              className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isIncome
                  ? "bg-landing-primary text-[#003518] hover:brightness-110"
                  : "bg-[#FF4F5F] text-white hover:brightness-110"
              }`}
            >
              <Add className="size-4" />
              {isIncome ? "Update Income" : "Update Expense"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}