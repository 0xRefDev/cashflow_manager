import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { loginUser } from "@/services/server/user.services";

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();
    const { user, token } = await loginUser(data);

    const res = NextResponse.json({ success: true, user });

    res.cookies.set("cashflow_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_MAX_AGE,
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
