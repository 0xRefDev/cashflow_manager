import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { markAllAsRead } from "@/services/server/notification.services";
import { serverError, clientError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const count = await markAllAsRead(userId);

    return NextResponse.json({ success: true, markedAsRead: count });
  } catch {
    return serverError();
  }
}