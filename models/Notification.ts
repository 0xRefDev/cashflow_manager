import mongoose, { Document, Schema } from "mongoose";

export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  category: "Financial" | "Security" | "System";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["Financial", "Security", "System"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, read: 1, timestamp: -1 });
NotificationSchema.index({ userId: 1, timestamp: -1 });

const Notification = mongoose.models.Notification || mongoose.model<NotificationDocument>("Notification", NotificationSchema);

export default Notification;