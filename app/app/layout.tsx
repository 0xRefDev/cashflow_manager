"use client";

import { useState, useEffect, useRef } from "react";
import Scrollbar from 'smooth-scrollbar';
import { Aside } from "@/components/app/Aside";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      Scrollbar.init(scrollRef.current, {
        damping: 0.1,
        thumbMinSize: 10,
        renderByPixels: true,
        alwaysShowTracks: false,
        continuousScrolling: true,
        plugins: {
          overscroll: {
            enable: true,
            effect: 'glow',
            damping: 0.1,
            maxOverscroll: 150,
            glowColor: 'yellow',
          },
        },
      });
    }

    return () => {
      if (scrollRef.current) {
        Scrollbar.destroy(scrollRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen overflow-hidden bg-[#0E0E0E]">
      <Aside collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main ref={scrollRef} className="overflow-hidden">
        {children}
      </main>
    </div>
  );
}
