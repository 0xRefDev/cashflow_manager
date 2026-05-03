import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OtpCode from "@/models/OtpCode";
import User from "@/models/User";
import { OtpVerifySchema } from "@/lib/schemas";
import { validationError, serverError, clientError } from "@/lib/api";
import { checkRateLimit, getRateLimitKey } from "@/lib/ratelimit";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(getRateLimitKey("otp-verify", req), { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const { email, code } = OtpVerifySchema.parse(body);

    const otp = await OtpCode.findOne({ email, code, used: false });

    if (!otp) {
      return clientError("Invalid verification code");
    }

    if (otp.expiresAt < new Date()) {
      await OtpCode.deleteOne({ _id: otp._id });
      return clientError("Code has expired. Request a new one.");
    }

    otp.used = true;
    await otp.save();

    await User.findOneAndUpdate({ email }, { verified: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    return serverError();
  }
}
