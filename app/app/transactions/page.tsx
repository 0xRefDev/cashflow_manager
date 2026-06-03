"use client";

import { useRouter } from "next/navigation";
import { Help } from "@/icons/Help";
import { Bell } from "@/icons/app/Bell";
import { History } from "@/icons/app/History";
import Link from "next/link";

import { MainHeader } from "@/components/app/MainHeader";
import { AddTransaction } from "@/components/app/AddTransaction";

export default function Page() {
  const router = useRouter();

  const headerOptions = [
    {
      label: <Bell className="w-6 h-6" />,
      action: () => router.push("/app/notifications")
    },
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help")
    }
  ];

  return (
    <section className="min-h-screen text-white relative">
      <MainHeader title="Manage your transactions" options={headerOptions} />

      <div className="absolute bottom-0 left-0 right-0 top-17 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[20px_40px] mask-[radial-gradient(ellipse_75%_65%_at_50%_0%,#000_20%,transparent_100%)] pointer-events-none" />
      <div className="absolute -right-30 top-0 size-75 bg-[#6E9BFF]/13 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute left-[20%] bottom-[50%] size-37.5 bg-landing-primary/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute right-[25%] bottom-[10%] size-25 bg-landing-primary/8 blur-2xl rounded-full pointer-events-none" />

      <article className="relative z-10 w-fit flex flex-col items-center 2xl:justify-center h-dvh px-6 pt-2 2xl:pt-0 pb-4 mx-auto gap-4">
        <div className="self-stretch flex justify-between items-center w-120">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-2xl font-semibold">Register Movement</h2>
            <p className="text-xs sm:text-sm text-[#ADAAAA]">Meticulously track your wealth evolution.</p>
          </div>
          <Link href={"/app/reports"} className="flex items-center gap-1.5 bg-[#1D1B1B] border border-white/5 px-3 py-1.5 rounded-xl hover:border-landing-primary/20 hover:bg-[#252323] transition-all cursor-pointer">
            <History className="w-4 h-4 text-landing-primary" />
            <span className="text-xs font-medium text-white/90">History</span>
          </Link>
        </div>

        <article className="relative w-120 h-fit bg-[#1d1b1b] p-6 rounded-2xl shadow-xl shadow-black/30 border border-landing-primary/2">
          <span className="absolute bg-linear-to-r from-landing-primary-0 via-landing-primary/50 to-landing-primary/0 w-full h-0.5 top-0 left-0"></span>
          <AddTransaction />
        </article>
      </article>
    </section>
  );
}
