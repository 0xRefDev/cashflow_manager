"use client";

import { useRouter } from "next/navigation";

import { MainHeader } from "@/components/app/MainHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell } from "@/icons/app/Bell";
import { Help } from "@/icons/Help";

export default function Dashboard() {

  const router = useRouter();

  const headerOptions = [
    {
      label: <Bell className="w-6 h-6" />,
      action: () => router.push("/app/notifications")
    },
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help")
    }
  ];

  const profile = useAuthStore((s) => s.profile);

  return (
    <section className="min-h-screen text-white">
      <MainHeader 
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
            Welcome back,{" "}
            <span className="text-landing-primary">{profile?.fullname ?? "—"}!</span>
          </p>
          </div>
        } 
        options={headerOptions}
      />

      <article className="p-4 bg-white/5 h-full">

      </article>
    </section>
  );
}
