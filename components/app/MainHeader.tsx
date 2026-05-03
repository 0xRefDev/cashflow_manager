"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MainHeaderProps } from "@/types/header.types";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/icons/User";

import { Logout } from "@/icons/app/Logout";


export function MainHeader({ title, options, anchor }: MainHeaderProps) {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  

  const displayName = profile?.fullname ?? user?.fullname ?? "";
  const photoUrl = profile?.profile_photo ?? user?.profile_photo ?? null;


  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4"
      style={{
        background: "rgba(10,10,10,0.75)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        {anchor && <div className="shrink-0">{anchor}</div>}
        <h1 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {options?.map((option, index) => (
          <button
            key={index}
            onClick={() => option.action()}
            className="text-xs sm:text-sm text-white/50 hover:text-white/90 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-landing-primary/15 cursor-pointer"
          >
            {option.label}
          </button>
        ))}

        <button
          className="text-xs sm:text-sm text-white/50 hover:text-white/90 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-landing-primary/15 cursor-pointer"
          onClick={async () => {
            await logout();
            router.push("/auth/login");
          }}
        >
          <Logout className="w-6 h-6" />
        </button>

        <button
          className="relative shrink-0 flex items-center justify-center rounded-full overflow-hidden transition-opacity duration-200 hover:opacity-80"
          style={{
            width: 34,
            height: 34,
            background: photoUrl ? "transparent" : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          title={displayName || "Profile"}
        >
          {photoUrl ? (
            <Image
              src={photoUrl as string || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj9uaOHSUP94_FgVeF4BtFT6hETgBW_a8xXw&s"}
              alt={displayName || "User avatar"}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <User
              width={16}
              height={16}
              className="text-white/50"
            />
          )}
        </button>
      </div>
    </header>
  );
}
