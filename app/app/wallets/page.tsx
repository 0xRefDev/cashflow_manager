"use client";

import { MainHeader } from "@/components/app/MainHeader";
import { useRouter } from "next/navigation";

import { Help } from "@/icons/Help";
import { Bell } from "@/icons/app/Bell";

export default function Page() {
  const router = useRouter();

  const headerOptions = [
    {
      label: <Bell className="w-6 h-6" />,
      action: () => router.push("/app/notifications"),
    },
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];
  return (
    <section className="h-full text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Manage your wallets
            </p>
          </div>
        }
        options={headerOptions}
      />
    </section>
  );
}
