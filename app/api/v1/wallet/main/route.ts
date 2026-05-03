import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getTopWallets } from "@/services/server/wallet.services";
import { assertObjectId, serverError, clientError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    assertObjectId(userId, "userId");

    const wallet = await getTopWallets(userId, 3);
    return NextResponse.json({ success: true, wallet });
  } catch (err) {
    return serverError();
  }
}