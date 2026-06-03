import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { updatePreferences, getPreferences } from "@/services/server/setting.services";
import { UpdatePreferencesSchema } from "@/lib/schemas";
import { validationError, serverError, clientError } from "@/lib/api";
import { logger } from "@/lib/logger";
import { ZodError } from "zod";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const body = await req.json();
    const parsed = UpdatePreferencesSchema.parse(body);

    const preferences = await updatePreferences({ ...parsed, userId });

    return NextResponse.json({ success: true, preferences });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && err.message === "Preferences not found") {
      return clientError("Preferences not found", 404);
    }
    logger.error("PATCH /preferences failed", err);
    return serverError();
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const preferences = await getPreferences(userId);

    if (!preferences) throw new Error("Preferences not found");

    return NextResponse.json({ preferences });

} catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}