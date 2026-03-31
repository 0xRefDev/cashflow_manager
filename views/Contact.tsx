"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

// Icons
import { Mail } from "@/icons/Mail";

export function Contact() {
  return (
    <section id="contact" className="min-h-screen bg-[#0a0a0a] py-20 px-1 sm:px-6 md:px-12 flex justify-center relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      {/* --- */}

      <div className="max-w-6xl w-full bg-[#141414] rounded-[16px] px-4 py-3 md:px-8 md:py-16 lg:px-12 lg:py-20 flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10 border border-white/5 shadow-2xl">
        <div className="flex-1 flex flex-col text-left">
          <h2 className="text-xl lg:text-2xl text-center md:text-left md:text-3xl font-bold text-white mt-6 mb-8 tracking-tight">
            Precision Support for your Financial Journey.
          </h2>

          <p className="text-gray-400 text-md md:text-xl mb-12 text-left mx-auto">
            <h3 className="text-white/75 text-[0.90rem] lg:text-lg font-semibold text-left text-pretty">Have questions about transitioning your assets to CashFlow?</h3>
            <ul className="flex flex-col gap-3 list-disc pl-5 pt-2">
              <li><span className="text-white/50 text-[0.90rem] lg:text-[0.95rem]">Our dedicated team is ready to assist you in architecting your personal ledger.</span></li>
              <li><span className="text-white/50 text-[0.90rem] lg:text-[0.95rem]">From configuring your first multi-currency wallets to mastering your savings reputation.</span></li>
            </ul>
          </p>

          <div className="space-y-4 lg:absolute lg:bottom-10">
            <div className="flex items-center gap-5 group border border-white/5 rounded-2xl p-2 lg:w-80">
              <div className="w-14 h-14 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center text-[#4ade80] group-hover:bg-[#4ade80]/10 group-hover:border-[#4ade80]/30 transition-all duration-300">
                <Mail />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm font-medium">Email us at</span>
                <span className="text-gray-200 text-lg font-semibold group-hover:text-white transition-colors">support@cashflow.io</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-black/40 p-8 rounded-[16px] border border-white/5">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider ml-1">First Name</label>
                <Input
                  type="text"
                  placeholder="John"
                  id="firstName"
                  name="firstName"
                  value=""
                  onChange={() => { }}

                />
              </div>
              <div className="space-y-2.5">
                <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider ml-1">Last Name</label>
                <Input
                  type="text"
                  placeholder="Doe"
                  id="lastName"
                  name="lastName"
                  value=""
                  onChange={() => { }}

                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider ml-1">Your Email</label>
              <Input
                type="email"
                placeholder="email@company.com"
                id="email"
                name="email"
                value=""
                onChange={() => { }}

              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider ml-1">How can we help?</label>
              <textarea
                rows={4}
                placeholder="Your message..."
                id="message"
                name="message"
                value=""
                onChange={() => { }}
                className="w-full bg-[#111111] border border-white/5 rounded-xl py-2 px-4 text-white placeholder-gray-500 outline-none hover:border-white/10 focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all duration-300 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-landing-primary/70 hover:bg-landing-primary/80 text-[#0b4124] font-bold py-3 rounded-full transition-all duration-300 active:scale-[0.98] mt-4 shadow-xl shadow-white/5 text-lg"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}