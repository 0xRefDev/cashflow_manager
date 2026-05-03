import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserById } from "@/services/server/user.services";
import { sanitizeUser } from "@/utils/sanitizeUser";
import { UserDocument } from "@/types/user.types";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const user = await getUserById(userId);
    if (!user) return clientError("User not found", 404);

    const safeUser = sanitizeUser(user.toObject() as UserDocument);

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err) {
    void err;
    return serverError();
  }
}
