import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { addTransaction, getUserTransactions } from "@/services/server/transaction.services";
import { CreateTransactionSchema } from "@/lib/schemas";
import { validationError, serverError, clientError } from "@/lib/api";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const body = await req.json();
    const parsed = CreateTransactionSchema.parse(body);

    const transaction = await addTransaction({ ...parsed, userId });

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && err.message.includes("insufficient balance")) {
      return clientError("Insufficient balance in the selected wallet");
    }
    return serverError();
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const data = await getUserTransactions(userId, req.nextUrl.searchParams);

    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    void err;
    return serverError();
  }
}
