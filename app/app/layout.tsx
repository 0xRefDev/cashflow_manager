"use client";

import { useState, useEffect, useRef } from "react";
import Scrollbar from 'smooth-scrollbar';
import { Aside } from "@/components/app/Aside";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const scrollbarRef = useRef<ReturnType<typeof Scrollbar.init> | null>(null);

  useEffect(() => {
    if (scrollRef.current && !scrollbarRef.current) {
      scrollbarRef.current = Scrollbar.init(scrollRef.current, {
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
      // No destruir — el scrollbar persiste entre navegaciones
      // Destruir causaba race conditions con framer-motion exit animations
    };
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen overflow-hidden bg-[#0E0E0E]">
      <Aside collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main ref={scrollRef} className="overflow-hidden">
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
