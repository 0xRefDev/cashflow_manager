"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sileo } from "sileo";
import ChartImage from "@/assets/images/charts.webp";
import { ChevronLeft } from "@/icons/ChevronLeft";
import { ForwardArrow } from "@/icons/ForwardArrow";
import { useSetupStore } from "@/store/useSetupStore";

export function SetupLimitSpend() {
  const [spendLimit, setSpendLimit] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const step1 = useSetupStore((s) => s.step1);
  const clear = useSetupStore((s) => s.clear);

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

  async function handleSubmit() {
    const amount = parseFloat(spendLimit.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) {
      showError("Invalid Amount", "Please enter a valid spending limit greater than zero.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...step1,
          spend_limit: amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError("Setup Failed", data.message ?? "Something went wrong. Please try again.");
        return;
      }

      clear();
      router.push("/setup/step/completed");
    } catch {
      showError("Network Error", "Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="
      relative
      backdrop-blur-2xl
      bg-white/3
      border border-white/8
      p-5 lg:p-7
      w-full max-w-[460px]
      rounded-2xl
      shadow-[0_40px_80px_rgba(0,0,0,0.5)]
      flex flex-col gap-6
    ">
      <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 w-full h-40 lg:h-48 relative">
        <Image
          src={ChartImage}
          alt="Financial Chart"
          fill
          className="select-none object-cover opacity-60 transition-all duration-700"
        />
      </div>

      <article className="space-y-6">
        <div>
          <label className="uppercase font-bold text-[11px] text-landing-primary tracking-[0.15rem] block mb-3 font-inter">
            Define the spending limit
          </label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-medium text-[#ADAAAA]">$</span>
            <input
              type="text"
              placeholder="5,000.00"
              value={spendLimit}
              onChange={(e) => setSpendLimit(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-2xl font-semibold focus:border-landing-primary/50 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/setup/step/1"
            className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-2 bg-landing-primary text-[#042b17] py-4 rounded-2xl font-bold flex items-center cursor-pointer justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-landing-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Finish Setup"}
            {!loading && <ForwardArrow className="w-5 h-5" />}
          </button>
        </div>
      </article>
    </section>
  );
}
