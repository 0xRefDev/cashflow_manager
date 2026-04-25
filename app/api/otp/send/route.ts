import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OtpCode from "@/models/OtpCode";
import { sendOtpEmail } from "@/services/server/email.services";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();
    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email" }, {
        status: 400
      });
    }

    await OtpCode.deleteMany({ email });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpCode.create({ email, code, expiresAt });
    await sendOtpEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
