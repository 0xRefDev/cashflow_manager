"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { MainHeader } from "@/components/app/MainHeader";
import { Button } from "@/components/Button";
import { Divider } from "@/components/app/Divider";

import { Bell } from "@/icons/app/Bell";
import { Help } from "@/icons/Help";
import { Shield } from "@/icons/Shield";
import { GrowIndicator } from "@/icons/app/GrowIndicator";
import { Sparks } from "@/icons/Sparks";
import { DoubleCheck } from "@/icons/app/DoubleCheck";
import { Trash } from "@/icons/app/Trash";

import { notificationService } from "@/services/client/notification.services";
import { Notification, NotificationCategory } from "@/types/notification.types";

const CATEGORY_ICONS: Record<
  NotificationCategory,
  React.ComponentType<{ className?: string }>
> = {
  Financial: GrowIndicator,
  Security: Shield,
  System: Sparks,
};

const CATEGORY_BG: Record<NotificationCategory, string> = {
  Financial: "bg-landing-primary/15",
  Security: "bg-[#FF7351]/15",
  System: "bg-[#6E9BFF]/15",
};

const CATEGORY_BORDER: Record<NotificationCategory, string> = {
  Financial: "border-landing-primary/30",
  Security: "border-[#FF7351]/30",
  System: "border-[#6E9BFF]/30",
};

const CATEGORY_TEXT: Record<NotificationCategory, string> = {
  Financial: "text-landing-primary",
  Security: "text-[#FF7351]",
  System: "text-[#6E9BFF]",
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState<NotificationCategory | "All">(
    "All",
  );

  const tabs: { name: "All" | NotificationCategory; label: string }[] = [
    { name: "All", label: "All" },
    { name: "Financial", label: "Financial" },
    { name: "Security", label: "Security" },
    { name: "System", label: "System" },
  ];

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications({ limit: 50 });
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications =
    selectedTab === "All"
      ? notifications
      : notifications.filter((n) => n.category === selectedTab);

  const categoryCounts = useMemo(() => {
    return notifications.reduce(
      (acc, n) => {
        acc[n.category] = (acc[n.category] ?? 0) + 1;
        return acc;
      },
      {} as Partial<Record<NotificationCategory, number>>,
    );
  }, [notifications]);

  const headerOptions = [
    {
      label: <Help className="w-6 h-6" />,
      action: () => router.push("/app/help"),
    },
  ];

  if (loading) {
    return (
      <section className="flex flex-col gap-0 min-h-screen text-white">
        <MainHeader
          title={
            <div className="flex items-center gap-2">
              <p className="text-xl sm:text-2xl font-semibold text-white/90">
                Activity Hub{" "}
                <span className="text-landing-primary"> | Notifications</span>
              </p>
            </div>
          }
          options={headerOptions}
        />

        <SkeletonTheme baseColor="#1a1a1a" highlightColor="#262626">
          <article className="p-12 h-full">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48 rounded" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
            <section className="flex flex-col mt-4">
              <ul className="py-4 flex gap-10 text-white/80 text-sm">
                {tabs.map((tab) => (
                  <Skeleton key={tab.name} className="h-5 w-24 rounded" />
                ))}
              </ul>
              <Skeleton className="w-full h-px rounded-full bg-[#ADAAAA12]" />
              <article className="flex flex-col gap-4 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-md" />
                ))}
              </article>
            </section>
          </article>
        </SkeletonTheme>
      </section>
    );
  }

  const emptyState = filteredNotifications.length === 0;

  return (
    <section className="flex flex-col gap-0 min-h-screen text-white">
      <MainHeader
        title={
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold text-white/90">
              Activity Hub{" "}
              <span className="text-landing-primary"> | Notifications</span>
            </p>
          </div>
        }
        options={headerOptions}
      />

      <article className="p-12 h-full">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-3xl font-semibold">Notifications</h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 bg-[#185f34] text-white px-4 py-2 rounded-md hover:bg-landing-primary/40 transition-colors duration-300"
              >
                <DoubleCheck className="w-5 h-5" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <section className="flex flex-col mt-4">
          <ul className="py-4 flex gap-4 text-white/80 text-sm flex-wrap">
            {tabs.map((tab) => {
              const isActive = selectedTab === tab.name;
              const count =
                tab.name === "All"
                  ? notifications.length
                  : (categoryCounts[tab.name] ?? 0);

              return (
                <li
                  key={tab.name}
                  className={`flex items-center gap-1.5 cursor-pointer transition-colors duration-300 px-2 py-1 rounded ${
                    isActive
                      ? "text-landing-primary bg-landing-primary/10"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => setSelectedTab(tab.name)}
                >
                  {tab.label}
                  <span
                    className={`text-xs ${
                      isActive ? "text-landing-primary/70" : "text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
          <span className="w-full h-px rounded-full bg-[#ADAAAA12]" />
          <Divider />
          <article className="flex flex-col gap-4 mt-4">
            {emptyState ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/40">
                <Bell className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">No notifications yet</p>
                <p className="text-sm mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const CategoryIcon = CATEGORY_ICONS[notification.category];
                const bgColor = CATEGORY_BG[notification.category];
                const borderColor = CATEGORY_BORDER[notification.category];
                const textColor = CATEGORY_TEXT[notification.category];

                return (
                  <article
                    key={notification._id}
                    className={`group flex items-start gap-5 relative rounded-2xl p-6 border ${borderColor} bg-white/3 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 ${
                      !notification.read ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {!notification.read && (
                      <span className="absolute top-5 right-5 flex size-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-landing-primary/50" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-landing-primary" />
                      </span>
                    )}

                    <div
                      className={`flex shrink-0 justify-center items-center ${bgColor} size-16 rounded-2xl ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <CategoryIcon className={`w-8 h-8 ${textColor}`} />
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-16">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold truncate">
                          {notification.title}
                        </h3>
                        <div className="flex gap-2">
                          <span
                            className={`shrink-0 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}
                          >
                            {notification.category}
                          </span>
                          <span
                            className={`shrink-0 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${bgColor} ${textColor} ${notification.payload?.category ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                          >
                            {notification.payload?.category
                              ? `${notification.payload.category}`
                              : ""}
                          </span>
                        </div>
                      </div>
                      <p className="text-md text-white/70 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full gap-3 shrink-0">
                      <span className="text-xs text-white/50 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>

                      <div className="flex items-center gap-1 rounded-lg bg-black/20 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {!notification.read && (
                          <Button
                            className="rounded-md p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            onClick={() => handleMarkAsRead(notification._id)}
                            title="Mark as read"
                          >
                            <DoubleCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          className="rounded-md p-1.5 text-white/60 hover:text-[#FF7351] hover:bg-white/10 transition-colors duration-200"
                          onClick={() => handleDelete(notification._id)}
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </article>
        </section>
      </article>
    </section>
  );
}
