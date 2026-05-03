import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getPeriodSummary } from "@/services/server/reports.services";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") || "month") as "week" | "month" | "quarter" | "year";

    if (!["week", "month", "quarter", "year"].includes(period)) {
      return clientError("Invalid period. Use: week, month, quarter, or year");
    }

    const summary = await getPeriodSummary(userId, period);

    return NextResponse.json({ success: true, ...summary });
  } catch (err) {
    return serverError();
  }
}