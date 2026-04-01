"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

// Icons
import { Mail } from "@/icons/Mail";

export function Contact() {
  return (
    <section
      id="contact"
      className="bg-[#0a0a0a] py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 flex justify-center relative overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full bg-[#141414] rounded-2xl px-5 py-8 md:px-10 md:py-14 lg:px-14 lg:py-16 flex flex-col lg:flex-row gap-10 lg:gap-20 relative z-10 border border-white/5 shadow-xl shadow-black/10">

        <div className="flex-1 flex flex-col justify-between gap-8">
          <div className="space-y-5 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Precision Support for your Financial Journey
            </h2>

            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-md mx-auto lg:mx-0">
              Have questions about transitioning your assets to CashFlow?
            </p>

            <ul className="flex flex-col gap-2 text-sm sm:text-base text-white/60 max-w-md mx-auto lg:mx-0">
              <li>• Architect your personal ledger with expert guidance</li>
              <li>• Configure multi-currency wallets</li>
              <li>• Optimize your savings strategy</li>
            </ul>
          </div>

          <div className="flex items-center gap-4 group border border-white/5 rounded-2xl p-3 w-full sm:w-fit mx-auto lg:mx-0">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#4ade80] group-hover:bg-[#4ade80]/10 group-hover:border-[#4ade80]/30 transition-all duration-300">
              <Mail />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Email us at</span>
              <span className="text-gray-200 text-base font-semibold group-hover:text-white transition-colors">
                support@cashflow.io
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-black/40 p-6 sm:p-8 rounded-2xl border border-white/5 backdrop-blur-md">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  First Name
                </label>
                <Input type="text" placeholder="John" value="" onChange={() => { }} id="firstName" name="firstName" />
              </div>

              <div className="space-y-2">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Last Name
                </label>
                <Input type="text" placeholder="Doe" value="" onChange={() => { }} id="lastName" name="lastName" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Email
              </label>
              <Input type="email" placeholder="email@company.com" />
            </div>

            <div className="space-y-2">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us how we can help..."
                className="w-full bg-[#111111] border border-white/5 rounded-xl py-3 px-4 text-white placeholder-gray-500 outline-none hover:border-white/10 focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all duration-300 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-landing-primary/80 hover:bg-landing-primary text-[#0b4124] font-semibold py-3 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-black/20"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}