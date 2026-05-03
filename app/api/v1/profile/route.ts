import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserProfile, updateProfile } from "@/services/server/profile.services";
import { UpdateProfileSchema } from "@/lib/schemas";
import { validationError, serverError, clientError } from "@/lib/api";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const profile = await getUserProfile(userId);

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    void err;
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const body = await req.json();
    const parsed = UpdateProfileSchema.parse(body);

    const profile = await updateProfile(userId, parsed);

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    return serverError();
  }
}
