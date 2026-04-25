import { Header } from "@/components/landing/Header";
import { ChevronUp } from "@/icons/ChevronUp";

// Views
import { Hero } from "@/views/Hero";
import { Features } from "@/views/Features";
import { HowItWork } from "@/views/HowItWork";
import { Contact } from "@/views/Contact";

import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <main className="relative max-w-[1920px] mx-auto">
        <Header />

          <section className="flex flex-col">
            <Hero />
            <HowItWork />
            <Features />
          </section>
          <Contact />
          <Footer />

          <a href="#hero" className="fixed bottom-5 right-5 bg-[#88ec7b] text-black px-0.5 py-0.5 rounded-full hover:bg-[#74d469] transition-colors duration-300 z-1000"><ChevronUp /></a>
      </main>
    </>
  );
}