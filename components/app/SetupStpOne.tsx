import { StarShield } from "@/icons/StarShield";
import { World } from "@/icons/World";
import { Cash } from "@/icons/Cash";
import { Lock } from "@/icons/Lock";
import { Usd } from "@/icons/Usd";

export function SetupStpOne() {
  return (
    <>
      <div className="relative w-60 h-64 sm:w-86 sm:h-72 lg:w-100 lg:h-80 bg-[#131313] rounded-2xl flex flex-col items-center gap-4 border border-landing-primary/5 shadow-2xl shadow-landing-primary/5">
        {/* Glow */}
        <div className="absolute right-2 top-2 w-full h-[70%] bg-landing-primary/15 rounded-full blur-[100px] pointer-events-none lg:-right-20 lg:top-0 lg:w-[45%] lg:h-[60%] lg:blur-[120px] xl:-right-10 xl:w-[50%]" />
        {/*  */}

        <div className="absolute size-10 lg:size-12 -top-5 lg:-top-6 -left-5 lg:-left-8 bg-[#1f1f1f] rounded-lg flex items-center justify-center transform -rotate-18 border border-landing-primary/5 shadow-xl shadow-landing-primary/8 animate-rotate-y">
          <Lock className="text-landing-primary size-6 lg:size-8" />
        </div>

        <div className="absolute size-12 lg:size-16 -bottom-6 lg:-bottom-8 -right-8 lg:-right-13 bg-[#1f1f1f] rounded-lg flex items-center justify-center transform rotate-20 border border-landing-primary/5 -z-10 shadow-xl shadow-[#B1C9FF]/8 animate-wiggle-more animate-delay-[0.4s]">
          <Usd className="text-[#B1C9FF] size-6 lg:size-8" />
        </div>

        <div className="size-14 lg:size-20 bg-white/10 rounded-lg mt-6 lg:mt-10 flex items-center justify-center animate-jump">
          <StarShield className="text-landing-primary size-10 lg:size-14" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-32 lg:w-40 h-2 bg-white/10 rounded-lg"></div>
          <div className="w-20 lg:w-24 h-2 bg-white/6 rounded-lg"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white/10 rounded-lg"></div>
          <div className="w-2 h-2 bg-white/6 rounded-lg"></div>
          <div className="w-2 h-2 bg-white/6 rounded-lg"></div>
        </div>

        <div className="flex items-center justify-between w-full px-3">
          <div className="w-[47%] h-20 lg:h-25 bg-white/5 border border-landing-primary/20 rounded-lg flex flex-col items-center justify-evenly">
            <Cash className="text-landing-primary mt-2" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-[80%] h-2 bg-landing-primary/20 rounded-lg"></div>
              <div className="w-[50%] h-2 bg-landing-primary/10 rounded-lg"></div>
            </div>
          </div>
          <div className="w-[47%] h-20 lg:h-25 bg-white/5 border border-[#6E9BFF]/20 rounded-lg flex flex-col items-center justify-evenly">
            <World className="text-[#6E9BFF] mt-2" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-[80%] h-2 bg-[#6E9BFF]/20 rounded-lg"></div>
              <div className="w-[50%] h-2 bg-[#6E9BFF]/10 rounded-lg"></div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}