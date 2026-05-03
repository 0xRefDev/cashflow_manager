import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/server/user.services";
import { connectDB } from "@/lib/db";
import { RegisterSchema } from "@/lib/schemas";
import { validationError, serverError } from "@/lib/api";
import { checkRateLimit, getRateLimitKey } from "@/lib/ratelimit";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(getRateLimitKey("register", req), { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const parsed = RegisterSchema.parse(body);

    const user = await createUser(parsed);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && err.message.includes("User already exists")) {
      return NextResponse.json({ success: false, message: err.message }, { status: 409 });
    }
    return serverError();
  }
}
