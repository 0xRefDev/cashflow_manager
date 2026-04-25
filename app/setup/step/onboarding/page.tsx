"use client"

import Link from "next/link";
import { SetupStpOne } from "@/components/app/SetupStpOne";
import { SetupHeader } from "@/components/app/SetupHeader";

export default function Step1() {
  return (
    <>
      <SetupHeader />
      <main className="max-w-[1600px] mx-auto">

        <section className="flex flex-col lg:flex-row justify-center lg:justify-between items-center min-h-[calc(100vh-52px)] lg:min-h-[calc(100vh-72px)] px-6 sm:px-12 lg:px-15 gap-12 lg:gap-12 py-12 lg:py-0">

          <div className="flex flex-col gap-3 items-center lg:items-start text-center lg:text-left">
            <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl w-full lg:w-140 animate-fade-right">
              Let&apos;s setup your <span className="text-landing-primary animate-fade-right animate-delay-[0.45s]">account!</span>
            </h2>
            <p className="text-white/70 w-full max-w-sm lg:w-96 text-base lg:text-lg animate-fade-up animate-delay-[0.2s]">
              We just need a few configurations like your preferred{" "}
              <span className="text-white font-semibold">currency</span>,{" "}
              <span className="text-white font-semibold">region</span>, and{" "}
              <span className="text-white font-semibold">spending limits</span>{" "}
              to tailor the experience to your financial goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-4 lg:mt-6 w-full sm:w-auto">
              <Link
                href="/setup/step/1"
                className="text-[#042b17] font-semibold bg-landing-primary px-8 lg:px-10 py-3 rounded-lg flex items-center justify-center hover:bg-landing-primary/75 transition-colors duration-300 cursor-pointer animate-fade-up animate-delay-[0.3s]"
              >
                Go to setup your account
              </Link>
              <Link
                href="/dashboard"
                className="text-white font-semibold px-8 lg:px-14 py-3 rounded-lg bg-[#FF4938]/45 flex flex-col items-center justify-center hover:bg-[#FF4938]/60 transition-colors duration-300 cursor-pointer animate-fade-up animate-delay-[0.5s]"
              >
                Skip for now
                <span className="text-xs text-white/50">(not recommended)</span>
              </Link>
            </div>
          </div>

          <article className="sm:flex justify-center lg:justify-end shrink-0">
            <SetupStpOne />
          </article>

        </section>
      </main>
    </>
  )
}