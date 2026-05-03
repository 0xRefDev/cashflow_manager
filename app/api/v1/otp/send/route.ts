import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OtpCode from "@/models/OtpCode";
import { sendOtpEmail } from "@/services/server/email.services";
import { OtpSendSchema } from "@/lib/schemas";
import { validationError, serverError } from "@/lib/api";
import { checkRateLimit, getRateLimitKey } from "@/lib/ratelimit";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(getRateLimitKey("otp-send", req), { limit: 3, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const { email } = OtpSendSchema.parse(body);

    await OtpCode.deleteMany({ email });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpCode.create({ email, code, expiresAt });
    await sendOtpEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    return serverError();
  }
}
