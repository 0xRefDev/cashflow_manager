import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/cashflow-logo.webp";


export function Footer() {
  return (
    <>
      <footer className="flex flex-row justify-center items-center min-h-10 h-[4.05rem] border-t border-[#222222] w-full">
        <div className="flex items-center gap-2">
          <Link href="#" className="">
            <Image
              src={Logo}
              className="brightness-110 contrast-50"
              fetchPriority="low"
              alt="Logo"
              width={24}
              height={24}
            />
          </Link>
          <span className="text-white/40 text-xs font-manrope tracking-wider">© 2026 Cashflow | Made by <Link href="https://github.com/0xRefDev" target="_blank" rel="noopener noreferrer" className="text-landing-primary text-xs font-inter font-medium transition-colors duration-300 ease-in-out hover:text-landing-secondary cursor-pointer underline underline-offset-2">0xRef.dev</Link></span>
        </div>
      </footer>
    </>
  )
}