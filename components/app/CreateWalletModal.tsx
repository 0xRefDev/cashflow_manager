"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { CurrencySelect } from "@/components/app/CurrencySelect";
import { Cancel } from "@/icons/Cancel";

import { currencyService } from "@/services/client/currencies.services";
import { walletService } from "@/services/client/wallet.services";
import { sileo } from "sileo";
import { Currency } from "@/types/currencies.types";
import { Wallet } from "@/types/wallet.types";

export interface CreateWalletModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (wallet: Wallet) => void;
  wallet?: Wallet | null;
}

export function CreateWalletModal({ open, onClose, onSaved, wallet }: CreateWalletModalProps) {
  const isEditMode = Boolean(wallet);

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    currencyService
      .get()
      .then(setCurrencies)
      .catch((err) => console.error("Error fetching currencies:", err));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setName(wallet?.name ?? "");
      setDescription(wallet?.description ?? "");
      setCurrencyId(wallet?.currencyId._id ?? "");
      setError("");
    });
  }, [open, wallet]);

  function handleClose() {
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Wallet name is required.");
      return;
    }
    if (!currencyId) {
      setError("Please select a currency.");
      return;
    }

    setIsSubmitting(true);
    try {
      const savedWallet =
        isEditMode && wallet
          ? await walletService.update(wallet._id, {
              name: name.trim(),
              description: description.trim() || undefined,
              currencyId,
            })
          : await walletService.create({
              name: name.trim(),
              description: description.trim() || undefined,
              currencyId,
              balance: 0,
            });
      onSaved(savedWallet);
      onClose();
      sileo.success({
        title: isEditMode ? "Wallet Updated" : "Wallet Created",
        description: <span className="text-center">{name.trim()}</span>,
        fill: "black",
        styles: {
          title: "text-white!",
          description: "text-white/75!",
          badge: "bg-white/5!",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save wallet";
      setError(message);
      sileo.error({
        title: "Something went wrong",
        description: <span className="text-center">{message}</span>,
        fill: "black",
        styles: {
          title: "text-white!",
          description: "text-white/75!",
          badge: "bg-white/5!",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
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
        className="relative w-full max-w-md bg-[#131313] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 text-[#ADAAAA] hover:text-white transition-colors cursor-pointer"
        >
          <Cancel className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Edit Wallet" : "New Wallet"}
        </h2>
        <p className="text-[#ADAAAA] text-sm mt-1">
          {isEditMode
            ? "Update this wallet's details."
            : "Create a new wallet to start tracking your assets."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#ADAAAA] uppercase tracking-wide">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Wallet"
              maxLength={80}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#ADAAAA] uppercase tracking-wide">
              Description <span className="text-[#666]">(optional)</span>
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this wallet for?"
              maxLength={300}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#ADAAAA] uppercase tracking-wide">
              Currency
            </label>
            <CurrencySelect
              currencies={currencies}
              keyBy="_id"
              value={currencyId}
              onChange={setCurrencyId}
              placeholder="Select currency"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex justify-center items-center gap-2 bg-landing-primary text-[#014b24] font-semibold py-3 rounded-xl hover:bg-landing-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Wallet"}
          </Button>
        </form>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
