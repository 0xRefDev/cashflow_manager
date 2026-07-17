"use client";

import { CryptoAdvice } from "@/components/app/CryptoAdvice";
import { MainHeader } from "@/components/app/MainHeader";
import { Help } from "@/icons/Help";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const headerOptions = [
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];

  const upcomingFeatures = [
    {
      title: "Connect your wallets",
      description:
        "Link any wallet address and visualize all your holdings in a single unified dashboard.",
    },
    {
      title: "Real-time balance tracking",
      description:
        "Prices and portfolio values update live so you always know where you stand.",
    },
    {
      title: "Fiat & crypto side by side",
      description:
        "See your traditional accounts and digital assets together for a complete financial picture.",
    },
  ];

  return (
    <section className="h-full text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Manage your cryptos
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="flex flex-col gap-6 py-6 overflow-hidden">
        <div className="flex w-full gap-10 pl-25">

          <div className="flex shrink-0 flex-col gap-3 max-w-sm">
            <span className="w-fit text-xs font-semibold tracking-widest uppercase text-landing-primary border border-landing-primary/30 bg-landing-primary/10 rounded-full px-3 py-1">
              In development
            </span>
            <h1 className="text-3xl font-semibold text-white/90 leading-snug">
              Crypto wallet management <br />
              <span className="text-landing-primary/80">is on its way.</span>
            </h1>
            <p className="text-[#ADAAAA] text-base leading-relaxed">
              We&apos;re extending CashFlow to support digital assets. You&apos;ll soon
              be able to add wallets for each cryptocurrency you hold and manage
              everything from one place — no switching between apps.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {upcomingFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-[#131313] border border-r-0 border-[#ADAAAA]/5 rounded-l-xl p-5"
              >
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full border border-landing-primary/40 bg-landing-primary/10 flex items-center justify-center text-landing-primary text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-white/90">{feature.title}</p>
                  <p className="text-sm text-[#ADAAAA]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="px-25">
          <CryptoAdvice />
        </div>
      </article>
    </section>
  );
}