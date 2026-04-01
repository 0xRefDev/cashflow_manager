import Image from "next/image";
import Logo from "@/assets/images/cashflow-logo.webp";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        <div className="flex flex-col gap-4">
          <Image src={Logo} alt="Cashflow Logo" className="w-24 lg:w-28" />
          <p className="text-white/60 text-sm sm:text-base font-inter leading-relaxed">
            Elevating the standard of financial intelligence for the precision-minded individual.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold font-manrope text-lg">Product</h3>
          <ul className="flex flex-col gap-2 text-white/60 font-inter">
            <li><a href="#features" className="hover:text-landing-primary transition-colors">Features</a></li>
            <li><a href="#security" className="hover:text-landing-primary transition-colors">Security</a></li>
            <li><a href="#pricing" className="hover:text-landing-primary transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold font-manrope text-lg">Company</h3>
          <ul className="flex flex-col gap-2 text-white/60 font-inter">
            <li><a href="#" className="hover:text-landing-primary transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-landing-primary transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-landing-primary transition-colors">LinkedIn</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold font-manrope text-lg">Legal</h3>
          <ul className="flex flex-col gap-2 text-white/60 font-inter">
            <li><a href="#" className="hover:text-landing-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-landing-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-landing-primary transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="text-center text-white/60 text-sm font-inter">
          0xRef © 2026 CashFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}