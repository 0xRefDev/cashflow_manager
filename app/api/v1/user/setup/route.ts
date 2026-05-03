import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { completeUserSetup } from "@/services/server/user.services";
import { UserSetupSchema } from "@/lib/schemas";
import { validationError, serverError, clientError } from "@/lib/api";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) return clientError("Unauthorized", 401);

    const body = await req.json();
    const parsed = UserSetupSchema.parse(body);

    await completeUserSetup(userId, parsed);

    return NextResponse.json({ success: true, message: "Setup completed successfully" });
  } catch (err) {
    if (err instanceof ZodError) return validationError(err);
    if (err instanceof Error && err.message.includes("Currency")) {
      return clientError(err.message);
    }
    return serverError();
  }
}
