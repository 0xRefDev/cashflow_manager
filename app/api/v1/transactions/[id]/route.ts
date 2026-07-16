import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { deleteTransaction, getTransactionById, updateTransaction } from "@/services/server/transaction.services";
import { UpdateTransactionSchema } from "@/lib/schemas";
import { assertObjectId, serverError, clientError, validationError } from "@/lib/api";
import { ZodError } from "zod";

export async function PATCH(
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

    const body = await req.json();
    const parsed = UpdateTransactionSchema.parse(body);

    // Convert date string to Date object if provided
    const updateData: Parameters<typeof updateTransaction>[2] = { ...parsed };
    if (parsed.date) {
      updateData.date = new Date(parsed.date);
    }

    const transaction = await updateTransaction(id, userId, updateData);

    if (!transaction) return clientError("Movement not found", 404);

    return NextResponse.json({ success: true, transaction });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && err.message.includes("not found")) {
      return clientError("Movement not found", 404);
    }
    if (err instanceof Error && (err.message.includes("insufficient balance") || err.message.includes("Wallet not found"))) {
      return clientError(err.message, 400);
    }
    return serverError();
  }
}

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