import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { regenerateUserAvatar } from "@/services/server/avatar.services";
import { serverError, clientError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const result = await regenerateUserAvatar(userId);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return serverError();
  }
}