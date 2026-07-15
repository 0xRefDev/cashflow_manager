"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
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
            className="w-full max-w-sm bg-[#131313] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40"
          >
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-[#ADAAAA] text-sm mt-2">{description}</p>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isConfirming}
                className="flex-1 py-2.5 rounded-xl bg-[#FF4938] text-white font-medium hover:bg-[#FF4938]/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConfirming ? "Deleting..." : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
