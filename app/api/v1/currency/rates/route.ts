import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getExchangeRates } from "@/services/server/exchangeRates.services";
import { serverError } from "@/lib/api";

export async function GET() {
  try {
    await connectDB();

    const ratesDoc = await getExchangeRates();
    return NextResponse.json({ success: true, rates: ratesDoc?.rates ?? {} });
  } catch {
    return serverError();
  }
}
