"use client";

import { SetupHeader } from "@/components/app/SetupHeader";
import { StepsMark } from "@/components/app/StepsMark";
import { ForwardArrow } from "@/icons/ForwardArrow";
import { Check } from "@/icons/Check";
import Link from "next/link";

export default function Completed() {
  return (
    <>
      <SetupHeader />
      <main className="h-[calc(100vh-72px)] bg-[#0E0E0E] text-white flex flex-col overflow-hidden max-w-[1600px] mx-auto">

        <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto lg:overflow-hidden relative">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] bg-landing-primary/8 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[30%] bg-landing-primary/5 blur-[100px] pointer-events-none rounded-full" />

          <div className="w-full max-w-2xl 2xl:max-w-3xl flex flex-col items-center gap-6 lg:gap-4 2xl:gap-6 relative z-10">

            <article
              className="relative w-full flex flex-col items-center text-center gap-6 lg:gap-8 p-8 sm:p-10 lg:px-16 lg:py-8 2xl:px-20 2xl:py-12 rounded-[2.5rem] animate-fade-down animate-delay-200"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(48px) saturate(180%)",
                WebkitBackdropFilter: "blur(48px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: `
                  0 0 0 0.5px rgba(255,255,255,0.05) inset,
                  0 1.5px 0 rgba(255,255,255,0.10) inset,
                  0 40px 80px rgba(0,0,0,0.55),
                  0 8px 20px rgba(0,0,0,0.3)
                `,
              }}
            >
              <div
                className="absolute top-0 left-8 right-8 h-px pointer-events-none rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)",
                }}
              />

              <div className="space-y-2">
                <p className="text-[10px] lg:text-[11px] 2xl:text-[12px] font-semibold tracking-[0.1rem] text-[#ADAAAA] uppercase font-inter">
                  Account verification complete
                </p>
                <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-bold tracking-tight">
                  Everything is ready!
                </h1>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-landing-primary blur-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-500 rounded-full" />
                <div
                  className="relative w-24 h-24 sm:w-26 sm:h-26 2xl:w-32 2xl:h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #0DEA79 0%, #13EA79 100%)",
                    boxShadow: "0 0 48px rgba(13,234,121,0.25), 0 0 0 1px rgba(13,234,121,0.15)",
                  }}
                >
                  <Check className="w-12 h-12 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16" />
                </div>
              </div>

              <p className="text-[#ADAAAA] text-sm sm:text-base 2xl:text-lg max-w-xs sm:max-w-sm 2xl:max-w-md leading-relaxed">
                Financial control is crucial to achieve your economic goals. Your journey to mastery starts today.
              </p>
            </article>

            <article className="flex flex-col gap-3 sm:gap-2 w-full justify-center items-center">
              <div className="flex justify-center w-full">
                <StepsMark currentStep={3} isCompleted={true} />
              </div>

              <Link
                href="/dashboard"
                className="group bg-landing-primary text-[#042b17] px-8 lg:px-10 2xl:px-12 py-2 lg:py-3 rounded-2xl font-bold text-base 2xl:text-lg flex items-center gap-3 hover:bg-landing-primary/80 transition-all duration-200 animate-fade-up animate-delay-200"
                style={{
                  boxShadow: "0 12px 28px rgba(13,234,121,0.05), 0 0 0 1px rgba(13,234,121,0.10)",
                }}
              >
                Enter Dashboard
                <ForwardArrow className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </article>

          </div>
        </section>
      </main>
    </>
  );
}