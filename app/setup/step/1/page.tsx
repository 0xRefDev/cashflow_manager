"use client";

import { z } from "zod";
import { sileo } from "sileo";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSetupStore } from "@/store/useSetupStore";

import { CountriesList } from "@/utils/CountriesList";

import { SetupHeader } from "@/components/app/SetupHeader";
import { StepsMark } from "@/components/app/StepsMark";

import { ChevronLeft } from "@/icons/ChevronLeft";
import { ChevronRight } from "@/icons/ChevronRight";
import { World } from "@/icons/World";
import { Cash } from "@/icons/Cash";
import { Cake } from "@/icons/Cake";
import { ChevronDown } from "@/icons/ChevronDown";
import { Currency } from "@/types/currencies.types";

const StepOneSchema = z.object({
  gender: z.string().min(1, "Gender is required"),
  currency: z.string().min(1, "Currency is required"),
  country: z.string().min(1, "Country is required"),
  birthday: z.string().min(1, "Birthday is required"),
});


type StepOneValues = z.infer<typeof StepOneSchema>;


export default function Step1() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const router = useRouter();
  const setStep1 = useSetupStore((s) => s.setStep1);

  const { register, handleSubmit, formState: { errors } } = useForm<StepOneValues>({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      gender: "",
      currency: "",
      country: "",
      birthday: "",
    },
  });

  function showError(title: string, description: string) {
    sileo.error({
      title,
      description: <span className="text-center">{description}</span>,
      fill: "black",
      styles: {
        title: "text-white!",
        description: "text-white/75!",
        badge: "bg-white/5!",
      },
    });
  }

  function onSubmit(data: StepOneValues) {
    setStep1(data);
    router.push("/setup/step/2");
  }

  function onInvalid() {
    showError("Missing Fields", "Please fill in all required fields before continuing.");
  }

  useEffect(() => {
    fetch('/api/currency')
      .then((res) => res.json())
      .then((data) => setCurrencies(data.currencies));
  }, []);

  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white">
      <SetupHeader />

      <section className="max-w-[1200px] mx-auto px-6 py-12 lg:py-5 2xl:py-20 flex flex-col gap-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 lg:pt-2">
            <h1 className="text-4xl lg:text-3xl 2xl:text-5xl font-bold tracking-tight animate-fade-right">
              Personal Profile Setup
            </h1>
            <p className="text-[#ADAAAA] text-lg lg:text-xl animate-fade-right animate-delay-200">
              Tell us a bit about yourself to tailor your experience.
            </p>
          </div>
          <StepsMark currentStep={1} />
        </div>

        <span className="hidden lg:block absolute w-[90%] h-0.25 bg-white/10 rounded-full top-30 2xl:top-48 left-1/2 -translate-x-1/2"></span>

        <article className="
          relative
          w-full
          backdrop-blur-2xl
          bg-white/3
          border border-white/8 
          p-8 lg:p-12
          rounded-2xl
          shadow-[0_30px_60px_rgba(0,0,0,0.4)]
        ">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-3 animate-fade-down animate-delay-400">
              <label className="uppercase font-bold text-[10px] text-[#ADAAAA] tracking-[0.2em] ml-1 font-inter">Gender</label>
              <div className="relative">
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 appearance-none outline-hidden focus:border-landing-primary/50 transition-all text-sm"
                  {...register("gender")}
                  id="gender"
                >
                  <option value="" disabled selected>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADAAAA]" />
              </div>
            </div>

            <div className="space-y-3 animate-fade-down animate-delay-550">
              <label className="uppercase font-bold text-[10px] text-[#ADAAAA] tracking-[0.2em] ml-1 font-inter">Preferred Currency</label>
              <div className="relative">
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 appearance-none outline-hidden focus:border-landing-primary/50 transition-all text-sm"
                  {...register("currency")}
                  id="currency"
                >
                  <option value="" disabled selected>Select currency</option>
                  {currencies?.map((currency) => (
                    <option key={currency.name} value={currency.name}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
                <Cash className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADAAAA]" />
              </div>
            </div>

            <div className="space-y-3 animate-fade-down animate-delay-700">
              <label className="uppercase font-bold text-[10px] text-[#ADAAAA] tracking-[0.2em] ml-1 font-inter">Select your Country</label>
              <div className="relative">
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 appearance-none outline-hidden focus:border-landing-primary/50 transition-all text-sm"
                  {...register("country")}
                >
                  <option value="" disabled>Select country</option>
                  {CountriesList.map((country) => (
                    <option key={country.flag} value={country.name}>
                      {country.name} ({country.flag})
                    </option>
                  ))}
                </select>
                <World className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADAAAA]" />
              </div>
            </div>

            <div className="space-y-3 animate-fade-down animate-delay-850">
              <label className="uppercase font-bold text-[10px] text-[#ADAAAA] tracking-[0.2em] ml-1 font-inter">Birthday Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 outline-hidden focus:border-landing-primary/50 transition-all text-sm"
                  {...register("birthday")}
                />
                <Cake className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADAAAA]" />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-center justify-between mt-8">
              <Link
                href="/setup/step/onboarding"
                className="flex items-center gap-2 text-[#ffffff] hover:text-white transition-colors font-medium group cursor-pointer
                  bg-white/5
                  px-10 py-4 
                  hover:bg-white/10 border border-white/5
                  rounded-2xl 
                  hover:scale-[1.02] 
                  active:scale-[0.98] 
                  w-full sm:w-auto
                  animate-fade-up"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Link>

              <button
                type="submit"
                className="
                  group
                  flex items-center gap-3
                  bg-landing-primary
                  text-[#033f20]
                  px-10 py-4
                  rounded-2xl
                  font-bold cursor-pointer
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  w-full justify-center sm:w-auto
                  transition-all animate-fade-up
                "
              >
                <span>Next Step</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </form>
        </article>
      </section>
    </main>
  );
}