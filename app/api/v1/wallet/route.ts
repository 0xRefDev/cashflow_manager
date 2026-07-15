import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createWallet, getWalletByUserId, getWalletById, updateWallet, deleteWallet } from "@/services/server/wallet.services";
import { CreateWalletSchema, UpdateWalletSchema } from "@/lib/schemas";
import { validationError, serverError, clientError } from "@/lib/api";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const body = await req.json();
    const parsed = CreateWalletSchema.parse(body);

    const wallet = await createWallet({ ...parsed, userId });

    return NextResponse.json({ success: true, wallet }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    return serverError();
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const walletId = req.nextUrl.searchParams.get("id");

    if (walletId) {
      const wallet = await getWalletById(walletId, userId);
      if (!wallet) return clientError("Wallet not found", 404);
      return NextResponse.json({ success: true, wallet });
    }

    const wallets = await getWalletByUserId(userId);
    return NextResponse.json({ success: true, wallets });
  } catch (err) {
    if (err instanceof Error && err.message === "Wallet not found") {
      return clientError("Wallet not found", 404);
    }
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const walletId = req.nextUrl.searchParams.get("id");
    if (!walletId) return clientError("Wallet id is required", 400);

    const body = await req.json();
    const parsed = UpdateWalletSchema.parse(body);

    const wallet = await updateWallet(walletId, userId, parsed);

    return NextResponse.json({ success: true, wallet });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && err.message === "Wallet not found") {
      return clientError("Wallet not found", 404);
    }
    return serverError();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const walletId = req.nextUrl.searchParams.get("id");
    if (!walletId) return clientError("Wallet id is required", 400);

    await deleteWallet(walletId, userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Wallet not found") {
      return clientError("Wallet not found", 404);
    }
    return serverError();
  }
}
