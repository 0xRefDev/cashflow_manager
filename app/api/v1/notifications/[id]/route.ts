import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { deleteNotification } from "@/services/server/notification.services";
import { assertObjectId, serverError, clientError } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) return clientError("Unauthorized", 401);
    if (!id) return clientError("ID is required");

    assertObjectId(id, "notificationId");

    const body = await req.json();
    const { read } = body;

    if (read !== true) {
      return clientError("Only 'read: true' is supported", 400);
    }

    const { markAsRead } = await import("@/services/server/notification.services");
    const notification = await markAsRead(id, userId);

    if (!notification) return clientError("Notification not found", 404);

    return NextResponse.json({ success: true, notification });
  } catch {
    return serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) return clientError("Unauthorized", 401);
    if (!id) return clientError("ID is required");

    assertObjectId(id, "notificationId");

    const deleted = await deleteNotification(id, userId);

    if (!deleted) return clientError("Notification not found", 404);

    return NextResponse.json({ success: true });
  } catch {
    return serverError();
  }
}