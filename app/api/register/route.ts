import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/server/user.services";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();
    const user = await createUser(data);

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 400 }
    );
  }
}