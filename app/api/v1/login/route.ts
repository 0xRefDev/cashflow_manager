import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { loginUser } from "@/services/server/user.services";
import { LoginSchema } from "@/lib/schemas";
import { validationError, serverError } from "@/lib/api";
import { checkRateLimit, getRateLimitKey } from "@/lib/ratelimit";
import { ZodError } from "zod";

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(getRateLimitKey("login", req), { limit: 10, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const parsed = LoginSchema.parse(body);

    const { user, token } = await loginUser(parsed);

    const res = NextResponse.json({ success: true, user });

    res.cookies.set("cashflow_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_MAX_AGE,
      path: "/",
    });

    return res;
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && (err.message === "Invalid credentials" || err.message.includes("isn't active"))) {
      return NextResponse.json({ success: false, message: err.message }, { status: 401 });
    }
    return serverError();
  }
}
