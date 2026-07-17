export type NotificationCategory = "Financial" | "Security" | "System";

export interface CreateNotificationInput {
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
}

export interface Notification {
  _id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  payload?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilter {
  category?: NotificationCategory | "All";
  read?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}