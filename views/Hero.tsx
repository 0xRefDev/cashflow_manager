import Image from "next/image";
import DashImage from "@/assets/images/dash.webp";

import { Button } from "@/components/Button";
import { Pill } from "@/components/Pill"

import { ForwardArrow } from "@/icons/ForwardArrow";

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen h-dvh lg:h-[165dvh] 2xl:h-[115dvh] w-full relative flex justify-center pt-24 lg:pt-32"
    >

      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[70%] bg-[#113b2c30] rounded-full blur-3xl pointer-events-none" />

      <article className="relative z-10 w-full flex flex-col mx-auto select-none">
        <div className="flex flex-col gap-2 lg:gap-3 items-center text-center">
          <Pill className="lg:text-[1rem] lg:px-4 lg:py-1">The Precision Ledger</Pill>

          <h1 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight mt-1 lg:mt-0 font-manrope">
            Master Your{" "}
            <span className="text-landing-primary">Money</span>
          </h1>

          <p className="text-sm lg:text-lg text-gray-300 leading-relaxed mt-1 lg:mt-0 max-w-xs lg:max-w-md text-pretty">
            Navigate your financial journey with editorial clarity. Track every
            cent, forecast your growth, and achieve absolute fiscal sovereignty.
          </p>

          <div className="flex flex-col items-center gap-2 lg:gap-4 mt-2 lg:mt-8 w-full">
            <Button className="relative bg-[#32844e] text-white font-medium text-[17px] px-4 py-[0.35em] pl-5 h-[2.8em] rounded-[0.9em] flex items-center overflow-hidden cursor-pointer ">
              <span className="mr-10">Get started</span>
              <div
                className="absolute right-[0.3rem] bg-white h-[2.2rem] w-[2.2rem] rounded-[0.7rem] flex items-center justify-center transition-all duration-300 active:scale-95"
              >
                <ForwardArrow />
              </div>
            </Button>
            <p className="w-full text-xs text-center text-gray-400 font-inter">
              No credit card required ● Free plan forever
            </p>
          </div>

          <div className="relative w-full max-w-[1280px] lg:w-4xl lg:mt-2">
            <Image
              src={DashImage}
              alt="CashFlow Dashboard Preview"
              className="w-full px-2 h-auto object-cover drop-shadow-xl drop-shadow-black/60 select-none max-w-[1280px]"
              style={{
                maskImage: 'linear-gradient(to bottom, black 30%, rgba(0,0,0,0) 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 30%, rgba(0,0,0,0) 85%)',
              }}
              priority
            />
          </div>
        </div>
      </article>
    </section>
  );
}