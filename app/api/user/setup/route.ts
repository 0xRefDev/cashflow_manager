import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { completeUserSetup } from "@/services/server/user.services";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await completeUserSetup(userId, body);

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully",
      user: updatedUser
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}