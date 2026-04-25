"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "../Button";

import Logo from "@/assets/images/cashflow-logo.webp";
import { Dashboard } from "@/icons/app/Dashboard";
import { Account } from "@/icons/app/Account";
import { Transactions } from "@/icons/app/Transactions";
import { Analytics } from "@/icons/app/Analytics";
import { Reports } from "@/icons/app/Reports";
import { Crypto } from "@/icons/app/Crypto";
import { Settings } from "@/icons/app/Settings";
import { ChevronLeft } from "@/icons/ChevronLeft";
import { Add } from "@/icons/app/Add";

interface AsideProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function Aside({ collapsed, onToggle, className }: AsideProps) {
  const options = [
    { name: "Dashboard", path: "/app/dashboard", icon: Dashboard },
    { name: "Account", path: "/app/account", icon: Account },
    { name: "Transactions", path: "/app/transactions", icon: Transactions },
    { name: "Analytics", path: "/app/analytics", icon: Analytics },
    { name: "Reports", path: "/app/reports", icon: Reports },
    { name: "Crypto", path: "/app/undev", icon: Crypto },
    { name: "Settings", path: "/app/settings", icon: Settings },
  ];

  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  return (
    <aside
      className={`
        ${collapsed ? "w-14" : "w-56"}
        bg-[#131313] h-screen shrink-0
        transition-[width] duration-300 ease-in-out
        flex flex-col py-5 overflow-hidden
        ${className ?? ""}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 px-3 mb-4 ${collapsed ? "justify-center" : ""}`}>
        <Image
          src={Logo}
          alt="Cashflow Logo"
          loading="eager"
          className="w-8 lg:w-9 h-auto shrink-0"
        />
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
        >
          <h1 className="text-landing-primary font-bold text-[1rem] lg:text-[1.1rem] font-manrope whitespace-nowrap">
            CashFlow
          </h1>
          <p className="uppercase text-[#ADAAAA] tracking-[0.05rem] text-[0.6rem] lg:text-[0.7rem] font-manrope font-light whitespace-nowrap">
            The precision ledger
          </p>
        </div>
      </div>

      <nav className="flex-1 px-2">
        <ul className="flex flex-col gap-1">
          {options.map((opt) => (
            <li
              key={opt.name}
              className={`
                ${isActive(opt.path)
                  ? "bg-linear-to-r from-landing-primary/12 to-landing-primary/3 border-r-2 border-landing-primary"
                  : "hover:bg-white/8 border-r-2 border-transparent hover:border-white/15"
                }
                w-full transition-all duration-100 ease-in-out rounded-l-sm
              `}
            >
              <Link
                href={opt.path}
                className={`
                  ${isActive(opt.path) ? "text-landing-primary" : "text-[#ADAAAA]"}
                  ${collapsed ? "justify-center px-0" : "pl-3 gap-3"}
                  text-sm font-inter w-full flex items-center py-3 transition-all duration-300
                `}
              >
                <opt.icon className="shrink-0 w-[18px] h-[18px]" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                >
                  {opt.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex px-3 w-full justify-center mb-4">
        <Link href="/app/transactions" title="New Transaction" aria-label="New Transaction" className={`flex items-center gap-2 bg-linear-to-r from-landing-primary to-[#13EA79] text-[#02361a] font-semibold ${collapsed ? "px-1 py-3" : "px-3 py-3"} w-full rounded-md justify-center`}>
          <Add className="size-6" />
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "hidden" : ""}`}>
            New Transaction
          </span>
        </Link>
      </div>

      <div className="border-t border-white/5 pt-3 px-2">
        <Button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`
            w-full flex items-center py-2 px-1 rounded-lg
            text-[#ADAAAA] hover:text-white hover:bg-white/5
            transition-all duration-200 cursor-pointer
            ${collapsed ? "justify-center" : "gap-2"}
          `}
        >
          <ChevronLeft
            className={`w-4 h-4 shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""
              }`}
          />
          <span
            className={`text-xs font-inter overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
          >
            Collapse
          </span>
        </Button>
      </div>
    </aside>
  );
}
