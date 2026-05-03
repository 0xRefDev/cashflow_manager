import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getFinancialPulse } from "@/services/server/profile.services";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const pulse = await getFinancialPulse(userId);

    return NextResponse.json({ success: true, ...pulse });
  } catch (err) {
    return serverError();
  }
}