import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getFinancialSummary } from "@/services/server/analytics.services";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const summary = await getFinancialSummary(userId);

    return NextResponse.json({ success: true, ...summary });
  } catch (err) {
    return serverError();
  }
}