import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserById } from "@/services/server/user.services";
import { sanitizeUser } from "@/utils/sanitizeUser";
import { verifyToken } from "@/lib/jose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found in headers" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const safeUser = sanitizeUser(user.toObject ? user.toObject() : user);

    return NextResponse.json({
      success: true,
      user: safeUser,
    });

  } catch (err: unknown) {
    console.error("Error en endpoint /me:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}