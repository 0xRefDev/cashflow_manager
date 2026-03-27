import Image from "next/image";
import Logo from "@/assets/images/cashflow-logo.webp";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] grid grid-cols-2 lg:grid-cols-4">
      <article className="col-span-1 p-6 lg:p-12">
        <Image src={Logo} alt="Cashflow Logo" className="w-20 lg:w-26" />
        <p className="text-white/60 text-sm font-inter mt-2 text-pretty">Elevating the standard of financial intelligence for the precision-minded individual.</p>
      </article>
      <article className="col-span-1 p-6 lg:p-12">
        <h3 className="text-white font-bold font-manrope text-lg">Product</h3>
        <ul className="font-inter text-white/60 flex flex-col gap-2 mt-6">
          <li><a href="#features">Features</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
      </article>
      <article className="col-span-1 p-6 lg:p-12">
        <h3 className="text-white font-bold font-manrope text-lg">Company</h3>
        <ul className="font-inter text-white/60 flex flex-col gap-2 mt-6">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">LinkedIn</a></li>
        </ul>
      </article>
      <article className="col-span-1 p-6 lg:p-12">
        <h3 className="text-white font-bold font-manrope text-lg">Legal</h3>
        <ul className="font-inter text-white/60 flex flex-col gap-2 mt-6">
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </ul>
      </article>

      <article className="col-span-4 w-full flex justify-center items-center p-6 border-t border-white/10">
        <p className="text-white/60 text-sm font-inter text-pretty">0xRef © 2026 CashFlow. All rights reserved.</p>
      </article>
    </footer>
  )
} 