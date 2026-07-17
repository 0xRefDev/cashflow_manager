import "server-only";
import mongoose from "mongoose";
import Notification, { NotificationDocument } from "@/models/Notification";
import { CreateNotificationInput, NotificationFilter, NotificationCategory } from "@/types/notification.types";

export async function createNotification(data: CreateNotificationInput): Promise<NotificationDocument> {
  return Notification.create({
    userId: new mongoose.Types.ObjectId(data.userId),
    category: data.category,
    title: data.title,
    message: data.message,
    timestamp: new Date().toISOString(),
    payload: data.payload ?? {},
    read: false,
  });
}

export async function getNotifications(
  userId: string,
  filter: NotificationFilter = {}
): Promise<{
  notifications: NotificationDocument[];
  pagination: { total: number; page: number; limit: number; pages: number };
  unreadCount: number;
}> {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

  if (filter.category) query.category = filter.category;
  if (filter.read !== undefined) query.read = filter.read;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId: new mongoose.Types.ObjectId(userId), read: false }),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    unreadCount,
  };
}

export async function markAsRead(notificationId: string, userId: string): Promise<NotificationDocument | null> {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId: new mongoose.Types.ObjectId(userId) },
    { $set: { read: true } },
    { new: true }
  ).lean();
}

export async function markAllAsRead(userId: string): Promise<number> {
  const result = await Notification.updateMany(
    { userId: new mongoose.Types.ObjectId(userId), read: false },
    { $set: { read: true } }
  );
  return result.modifiedCount;
}

export async function deleteNotification(notificationId: string, userId: string): Promise<boolean> {
  const result = await Notification.deleteOne({
    _id: notificationId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  return result.deletedCount > 0;
}