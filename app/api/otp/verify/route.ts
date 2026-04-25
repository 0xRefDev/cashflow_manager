import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OtpCode from "@/models/OtpCode";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, code } = await req.json();
    if (typeof email !== "string" || typeof code !== "string") {
      return NextResponse.json({ success: false, message: "Invalid input" }, {
        status: 400
      });
    }

    const otp = await OtpCode.findOne({ email, code, used: false });

    if (!otp) {
      return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 400 });
    }

    if (otp.expiresAt < new Date()) {
      await OtpCode.deleteOne({ _id: otp._id });
      return NextResponse.json({ success: false, message: "Code has expired. Request a new one." }, { status: 400 });
    }

    otp.used = true;
    await otp.save();

    await User.findOneAndUpdate({ email }, { verified: true });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
