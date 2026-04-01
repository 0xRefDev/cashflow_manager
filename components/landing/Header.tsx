"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/images/cashflow-logo.webp";
import { Button } from "../Button";
import { BurgerBtn } from "../BurgerBtn";

import { BurgerMenu } from "@/icons/BurgerMenu";
import { Cancel } from "@/icons/Cancel";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <header className=" fixed left-1/2 -translate-x-1/2 top-0 z-50 flex justify-between items-center px-3 py-2 lg:px-6 lg:py-3 w-[90%] lg:w-full mt-2 lg:mt-4 mx-auto rounded-xl lg:rounded-2xl max-w-[1024px] lg:gap-18 gap-6 bg-white/6 backdrop-blur-2xl [-webkit-backdrop-filter:blur(40px)_saturate(180%)] [backdrop-filter:blur(40px)_saturate(180%)] border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.08)_inset]">

        <article className="flex lg:w-25 items-center gap-2">
          <Image src={Logo} alt="Cashflow Logo" className="w-10 lg:w-12" />
          <p className="text-lg font-bold text-landing-primary">CashFlow</p>
        </article>

        <article className="hidden lg:flex items-center gap-2">
          <ul className="flex items-center gap-5 font-manrope">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.slice(1);
              const isActive = activeSection === id;
              return (
                <li key={id}>
                  <a
                    href={href}
                    className={[
                      "whitespace-nowrap text-[0.875rem] relative pb-1 transition-colors duration-300",
                      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full",
                      "after:bg-landing-primary after:transition-all after:duration-300",
                      isActive
                        ? "text-landing-primary after:w-full"
                        : "text-white/80 hover:text-white after:w-0 hover:after:w-full",
                    ].join(" ")}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="hidden lg:flex items-center gap-2">
          <Link href="/auth/login" className="bg-transparent text-white border border-white px-2.5 py-1 rounded-full font-medium hover:bg-white hover:text-black transition-colors duration-300 text-[0.875rem]">
            Login
          </Link>
          <Link href="/auth/register" className="bg-linear-to-r from-landing-primary to-[#13EA79] text-[#0b4124] hover:from-landing-primary/80 hover:to-[#13EA79]/80 px-2.5 py-1 rounded-full font-bold shadow-lg shadow-landing-primary/5 text-[0.875rem] whitespace-nowrap">
            Sign Up
          </Link>
        </article>

        <BurgerBtn
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-landing-primary transition-all duration-200"
        >
          <BurgerMenu />
        </BurgerBtn>
      </header>

      <div
        id="mobile-menu-overlay"
        onClick={() => setMenuOpen(false)}
        className={[
          "lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      <nav
        id="mobile-menu-drawer"
        aria-label="Mobile navigation"
        className={[
          "lg:hidden fixed top-0 right-0 z-50 h-full w-[min(80vw,320px)] bg-[#0D0D0D]/95 backdrop-blur-2xl border-l border-white/10",
          "flex flex-col pt-24 pb-10 px-8 gap-8",
          "shadow-2xl shadow-black/60",
          "transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <BurgerBtn menuOpen={menuOpen} setMenuOpen={setMenuOpen} className="absolute top-6 right-9">
          <Cancel></Cancel>
        </BurgerBtn>
        <ul className="flex flex-col gap-2 font-manrope">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <a
                  href={href}
                  onClick={handleNavClick}
                  className={[
                    "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    "relative overflow-hidden",
                    isActive
                      ? "text-landing-primary bg-landing-primary/10"
                      : "text-white/70 hover:text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-landing-primary" />
                  )}
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleNavClick}
            className="w-full bg-transparent text-white border border-white/30 px-6 py-2.5 rounded-full font-medium hover:bg-white hover:text-black transition-colors duration-300"
          >
            Login
          </Button>
          <Button
            onClick={handleNavClick}
            className="w-full bg-linear-to-r from-landing-primary to-[#13EA79] text-[#0b4124] px-6 py-2.5 rounded-full font-bold shadow-lg shadow-landing-primary/20"
          >
            Sign Up
          </Button>
        </div>
      </nav>
    </>
  );
}


/*
        

        

        


*/