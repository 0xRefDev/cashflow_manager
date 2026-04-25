"use client";

import { useRef, useState, ClipboardEvent, KeyboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OtpInput({ length = 6, onComplete, disabled, hasError }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const digit = val.slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const full = next.join("");
    if (next.every((d) => d !== "")) {
      onComplete(full);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        setValues(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    const next = Array(length).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setValues(next);

    const lastIndex = Math.min(pasted.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (pasted.length === length) onComplete(pasted);
  }

  const borderColor = hasError ? "border-red-500/60 bg-red-500/5" : "border-white/10 bg-white/5";
  const focusBorder = hasError ? "focus:border-red-500" : "focus:border-landing-primary focus:bg-landing-primary/5";

  return (
    <div className="flex gap-2.5 justify-center sm:gap-3">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-bold text-white rounded-xl border transition-all duration-150 outline-none disabled:opacity-40 disabled:cursor-not-allowed caret-transparent ${borderColor} ${focusBorder}`}
        />
      ))}
    </div>
  );
}
