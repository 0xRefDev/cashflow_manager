import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  getLiveReport,
  parseMovementFilters,
} from "@/services/server/reports.services";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const filters = parseMovementFilters(searchParams);

    const report = await getLiveReport(userId, page, limit, filters);

    return NextResponse.json({ success: true, ...report });
  } catch (err) {
    return serverError();
  }
}