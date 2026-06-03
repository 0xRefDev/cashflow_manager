import { Pill } from "@/components/Pill";
import { BTC } from "@/icons/currencies/BTC";
import { SOL } from "@/icons/currencies/SOL";
import { USDC } from "@/icons/currencies/USDC";
import { ETH } from "@/icons/currencies/ETH";

export function CryptoAdvice() {
  return (
    <article className="w-full mt-2 pt-22 p-14 bg-black rounded-3xl shadow-2xl shadow-black/25 border border-[#ADAAAA]/5 flex items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute -right-30 top-0 size-75 bg-[#6E9BFF]/13 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute left-[20%] bottom-[50%] size-37.5 bg-landing-primary/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute right-[25%] bottom-[10%] size-25 bg-landing-primary/8 blur-2xl rounded-full pointer-events-none" />

      <Pill className="absolute top-10 left-14 self-start uppercase tracking-wide border-0 shadow-none px-4 py-1.5 text-[0.7rem]">
        The future of cashflow
      </Pill>
      <div className="flex flex-col w-full justify-start">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-semibold">Cryptocurrency Support</h2>
          <p className="text-3xl text-indigo-300 font-semibold underline underline-offset-10">
            Is Coming Soon!
          </p>
        </div>
        <p className="text-lg text-[#ADAAAA] mt-4 max-w-md text-pretty">
          Seamlessly bridge the gap between fiat and crypto. <br />
          Track your digital assets with the same precision you expect from
          CashFlow.
        </p>
      </div>

      <div className="flex items-center gap-4 bg-[#ADAAAA]/10 p-4 rounded-xl shadow-xl shadow-black/25 border border-[#ADAAAA]/5">
        <BTC className="w-10 h-auto" />
        <SOL className="w-10 h-auto" />
        <ETH className="w-10 h-auto" />
        <USDC className="w-10 h-auto" />
      </div>
    </article>
  );
}
