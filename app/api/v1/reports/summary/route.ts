import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  getPeriodSummary,
  parseMovementFilters,
} from "@/services/server/reports.services";
import { getPreferences } from "@/services/server/setting.services";
import { serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const filters = parseMovementFilters(searchParams);

    const preferences = await getPreferences(userId).catch(
      () => null as { baseCurrency?: string } | null,
    );
    const baseCurrency = preferences?.baseCurrency ?? "USD";

    const summary = await getPeriodSummary(userId, filters, baseCurrency);

    return NextResponse.json({ success: true, ...summary });
  } catch (err) {
    return serverError();
  }
}