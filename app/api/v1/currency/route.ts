import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAllCurrencies, getCurrencyByName } from "@/services/server/currency.services";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (name) {
      const currency = await getCurrencyByName(name);
      
      if (!currency) {
        return NextResponse.json({ success: false, message: "Currency not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, currency });
    } 
    
    const currencies = await getAllCurrencies();
    return NextResponse.json({ success: true, currencies });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}