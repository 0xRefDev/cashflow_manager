import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getNotifications } from "@/services/server/notification.services";
import { clientError, serverError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
    const category = searchParams.get("category");
    const read = searchParams.get("read");

    const filter: {
      page: number;
      limit: number;
      category?: "Financial" | "Security" | "System";
      read?: boolean;
    } = { page, limit };

    if (category) filter.category = category as "Financial" | "Security" | "System";
    if (read !== null) filter.read = read === "true";

    const data = await getNotifications(userId, filter);

    return NextResponse.json({ success: true, ...data });
  } catch {
    return serverError();
  }
}