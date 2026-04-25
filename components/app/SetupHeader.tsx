import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/images/cashflow-logo.webp";
import { Help } from "@/icons/Help";

export function SetupHeader() {
  return (
    <header className="bg-[#131313] px-4 lg:px-8 py-3 flex justify-between items-center w-full max-w-[1920px] mx-auto">
      <Link href="#" className="flex items-center gap-2">
        <Image src={Logo} alt="CashFlow Logo" className="w-8 lg:w-12" />
        <h1 className="text-landing-primary font-bold text-xl lg:text-2xl">CashFlow</h1>
      </Link>
      <div className="flex items-center gap-2">
        <Help className="text-white/70" />
      </div>
    </header>
  )
}