import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getChartData } from "@/services/server/analytics.services";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") || "30d") as "30d" | "6m" | "1y";

    if (!["30d", "6m", "1y"].includes(period)) {
      return clientError("Invalid period. Use: 30d, 6m, or 1y");
    }

    const chart = await getChartData(userId, period);

    return NextResponse.json({ success: true, ...chart });
  } catch (err) {
    return serverError();
  }
}