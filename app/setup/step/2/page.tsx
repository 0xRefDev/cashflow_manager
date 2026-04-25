"use client";

import { SetupHeader } from "@/components/app/SetupHeader";
import { StepsMark } from "@/components/app/StepsMark";
import { SetupLimitSpend } from "@/components/app/SetupLimitSpend";
import { EdgeLightCard } from "@/components/app/EdgeLightCard";
import { Thunder } from "@/icons/Thunder";
import { Wallet } from "@/icons/Wallet";

export default function Step2() {
  const edgeLightCards = [
    {
      icon: <Thunder className="w-6 h-6" />,
      title: "Encourage Habits",
      description: "Build a subconscious awareness of your daily transactions and cultivate long-term wealth habits.",
      iconClassName: "bg-landing-primary/10 text-landing-primary",
      className: "border-l-landing-primary",
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Control Expenses",
      description: "Prevent emotional purchases and keep your major monthly outgoings within a calculated safe zone.",
      iconClassName: "bg-cyan-400/10 text-cyan-400",
      className: "border-l-cyan-400",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white flex flex-col">
      <SetupHeader />

      <section className="grow flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-12 py-6 lg:py-4">
        
        <div className="w-full">
          <StepsMark currentStep={2} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center mt-6 lg:mt-3">
            
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] animate-fade-right">
                  Precision <span className="text-landing-primary">Limits</span> for Financial Freedom.
                </h1>
                <p className="text-[#ADAAAA] text-base lg:text-lg max-w-xl leading-relaxed animate-fade-right animate-delay-200">
                  Setting a spending limit isn&apos;t about restriction; it&apos;s about intentionality.
                  Define your boundaries to ensure every dollar serves your long-term vision.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {edgeLightCards.map((card, index) => (
                  <EdgeLightCard key={index} {...card} className={`animate-fade-right animate-delay-${index * 200 + 200}`} />
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end animate-fade-up animate-delay-200">
                <SetupLimitSpend />
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}