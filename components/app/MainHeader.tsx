"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MainHeaderProps } from "@/types/header.types";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/icons/User";
import { Logout } from "@/icons/app/Logout";
import { Bell } from "@/icons/app/Bell";
import Link from "next/link";
import { Button } from "../Button";
import { notificationService } from "@/services/client/notification.services";

const UNREAD_POLL_INTERVAL_MS = 30_000;

export function MainHeader({ title, options, anchor }: MainHeaderProps) {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useAuthStore((s) => s.logout);

  const displayName = profile?.fullname ?? user?.fullname ?? "";
  const photoUrl = profile?.profile_photo ?? user?.profile_photo ?? null;
  const isLoading = !hasHydrated;

  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications({ limit: 1 });
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, UNREAD_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const hasUnread = !!unreadCount && unreadCount > 0;
  const displayCount = unreadCount && unreadCount > 9 ? "9+" : unreadCount;

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
      <SkeletonTheme baseColor="#1e1e1e" highlightColor="#2a2a2a">
        <div className="flex items-center gap-3">
          {anchor && <div className="shrink-0">{anchor}</div>}
          {isLoading ? (
            <Skeleton width={180} height={20} />
          ) : (
            <h1 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => router.push("/app/notifications")}
            className="relative text-xs sm:text-sm text-white/50 hover:text-white/90 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-landing-primary/15 cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-6 h-6" />
            {hasUnread &&
              (displayCount ? (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-landing-primary text-[10px] font-semibold text-black leading-none">
                  {displayCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1.5 flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-landing-primary/50" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-landing-primary" />
                </span>
              ))}
          </Button>

          {options?.map((option, index) => (
            <Button
              key={index}
              onClick={() => option.action()}
              className="text-xs sm:text-sm text-white/50 hover:text-white/90 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-landing-primary/15 cursor-pointer"
            >
              {option.label}
            </Button>
          ))}

          <Button
            className="text-xs sm:text-sm text-white/50 hover:text-white/90 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-landing-primary/15 cursor-pointer"
            onClick={async () => {
              await logout();
              router.push("/auth/login");
            }}
          >
            <Logout className="w-6 h-6" />
          </Button>

          {isLoading ? (
            <div className="bg-landing-primary/10 py-1.5 px-2 w-30 rounded-lg flex items-center">
              <Skeleton circle width={34} height={34} />
              <div className="ml-2 flex-1">
                <Skeleton width={60} height={12} />
              </div>
            </div>
          ) : (
            <Link
              className="bg-landing-primary/10 py-1.5 px-2 w-30 rounded-lg flex items-center"
              href="/app/profile"
            >
              <div
                className="relative shrink-0 flex items-center justify-center rounded-full overflow-hidden transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                style={{
                  width: 34,
                  height: 34,
                  background: photoUrl
                    ? "transparent"
                    : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                title={displayName || "Profile"}
              >
                {photoUrl ? (
                  <Image
                    src={
                      (photoUrl as string) ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj9uaOHSUP94_FgVeF4BtFT6hETgBW_a8xXw&s"
                    }
                    alt={displayName || "User avatar"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <User width={16} height={16} className="text-white/50" />
                )}
              </div>
              <span
                className="ml-2 text-sm text-white/80 truncate"
                title={displayName}
              >
                @{profile?.username}
              </span>
            </Link>
          )}
        </div>
      </SkeletonTheme>
    </header>
  );
}