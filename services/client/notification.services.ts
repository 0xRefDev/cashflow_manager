export const notificationService = {
  async getNotifications(filter: {
    page?: number;
    limit?: number;
    category?: "Financial" | "Security" | "System";
    read?: boolean;
  } = {}) {
    const params = new URLSearchParams();
    if (filter.page) params.set("page", String(filter.page));
    if (filter.limit) params.set("limit", String(filter.limit));
    if (filter.category) params.set("category", filter.category);
    if (filter.read !== undefined) params.set("read", String(filter.read));

    const res = await fetch(`/api/v1/notifications?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch notifications");
    }
    return res.json();
  },

  async markAsRead(id: string) {
    const res = await fetch(`/api/v1/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to mark as read");
    }
    return res.json();
  },

  async markAllAsRead() {
    const res = await fetch("/api/v1/notifications/read-all", {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to mark all as read");
    }
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`/api/v1/notifications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete notification");
    }
    return res.json();
  },
};