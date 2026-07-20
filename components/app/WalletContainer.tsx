import { Wallet } from "@/types/wallet.types";
import { ChartComponent } from "./ChartComponent";
import { getCurrencyIcon } from "@/utils/Currencies";
import { GrowIndicator } from "@/icons/app/GrowIndicator";
import { DecreaseIndicator } from "@/icons/app/DecreaseIndicator";
import { SlotText } from "slot-text/react";
import "slot-text/style.css";
import { createElement } from "react";
import { usePreferences } from "@/hooks/usePreferences";

function CurrencyIcon({ code, className }: { code: string; className?: string }) {
  const resolved = getCurrencyIcon(code);
  return resolved ? createElement(resolved, { className }) : null;
}

export function WalletContainer({
  wallet,
  miniComponent,
}: {
  wallet: Wallet;
  miniComponent?: boolean;
}) {
  const { formatAmount, formatConverted, baseCurrency } = usePreferences();

  const { name, balance, transactions, percentage, currencyId } = wallet;
  const { name: currencyName } = currencyId;

  const displayBalance = balance ? formatAmount(balance, { currency: currencyName }) : formatAmount(0, { currency: currencyName });
  const convertedBalance = currencyName !== baseCurrency ? formatConverted(balance ?? 0, currencyName).converted : null;

  if (miniComponent) {
    return (
      <article className="relative flex flex-col w-70 h-40 rounded-lg border border-[#484847]/15 bg-[#0f0f0f]/60 backdrop-blur-md overflow-hidden group hover:border-landing-primary/20 transition-colors duration-300">
        <div className="flex items-center px-4 pt-3 h-15">
          <div className="flex items-center gap-3">
            <div className="bg-landing-primary/10 size-8 rounded-md flex justify-center items-center">
              <CurrencyIcon code={currencyName} className="size-4" />
            </div>

            <div className="leading-tight">
              <p className="text-sm text-[#ADAAAA] font-medium">{name}</p>
              <p className="text-lg font-semibold">
                <SlotText text={displayBalance} />
              </p>
              {convertedBalance && (
                <p className="text-xs text-white/40 font-medium">{convertedBalance}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p
                className={`text-sm flex items-center gap-1 font-medium ${percentage >= 0 ? "text-landing-primary" : "text-[#FF7351]"}`}
              >
                {percentage >= 0 ? (
                  <GrowIndicator className="size-4 text-landing-primary" />
                ) : (
                  <DecreaseIndicator className="size-4 text-[#FF7351]" />
                )}
                {percentage}%
              </p>
              <p className="text-xs text-[#ADAAAA]">7d</p>
            </div>
          </div>
        </div>

        {/* Mini chart */}
        <div className="flex-1 px-2 pb-2 min-h-0">
          {transactions?.length > 0 ? (
            <ChartComponent transactions={transactions} height={70} />
          ) : (
            <div className="h-17.5 rounded flex justify-center items-center">
              <p className="text-white/30 text-xs">No data</p>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden bg-radial-[at_50%_95%] from-landing-primary/8 to-landing-primary/0 to-70% border border-[#484847]/5 rounded-lg shadow-2xl shadow-black/20 w-[20rem] h-91.25">
      <header className="px-6 pt-6 flex justify-between items-center">
        <div className="bg-landing-primary/10 size-10 rounded-lg flex justify-center items-center">
          <CurrencyIcon code={currencyName} className="size-5" />
        </div>
        <div>
          <p
            className={`flex justify-end text-sm text-right ${percentage < 0 ? "text-red-500" : "text-landing-primary"} font-medium`}
          >
            {percentage}%
          </p>
          <p className="text-sm text-[#ADAAAA] font-medium">Last 7 Days</p>
        </div>
      </header>

      <div className="px-6 pt-4 font-manrope">
        <p className="text-sm text-[#ADAAAA] font-normal">
          {name} <span className="font-extrabold text-[16px]">/</span> Balance
        </p>
        <p className="text-2xl font-sans font-semibold">
          <SlotText text={displayBalance} />
        </p>
        {convertedBalance && (
          <p className="text-xs text-white/40 font-medium mt-0.5">{convertedBalance}</p>
        )}
      </div>

      <div className="px-6 pb-4">
        {transactions?.length > 0 ? (
          <ChartComponent transactions={transactions} />
        ) : (
          <div className="border border-landing-primary/15 bg-[#0f0f0f] h-55 mt-9 rounded-lg flex justify-center items-center">
            <p className="text-white/40 font-manrope font-semibold mb-7">
              No transactions found
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
