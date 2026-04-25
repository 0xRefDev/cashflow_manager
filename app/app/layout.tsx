"use client";

import { useState } from "react";
import { Aside } from "@/components/app/Aside";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen overflow-hidden bg-[#0E0E0E]">
      <Aside collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="overflow-auto">
        {children}
      </main>
    </div>
  );
}
