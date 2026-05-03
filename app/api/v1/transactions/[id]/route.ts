import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { deleteTransaction, getTransactionById } from "@/services/server/transaction.services";
import { assertObjectId, serverError, clientError } from "@/lib/api";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) return clientError("Unauthorized", 401);
    if (!id) return clientError("ID is required");

    assertObjectId(id, "transactionId");

    const result = await deleteTransaction(id, userId);

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) {
      return clientError("Movement not found", 404);
    }
    return serverError();
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) return clientError("Unauthorized", 401);
    if (!id) return clientError("ID is required");

    assertObjectId(id, "transactionId");

    const transaction = await getTransactionById(id, userId);

    if (!transaction) return clientError("Movement not found", 404);

    return NextResponse.json({ success: true, transaction });
  } catch (err) {
    return serverError();
  }
}
