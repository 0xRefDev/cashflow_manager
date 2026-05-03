import { NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";

export function assertObjectId(id: string, label = "ID") {
  if (!mongoose.isValidObjectId(id)) {
    throw Object.assign(new Error(`Invalid ${label} format`), { status: 400 });
  }
}

export function validationError(error: ZodError) {
  const issues = error.issues.map((i) => ({
    field: i.path.join("."),
    message: i.message,
  }));
  return NextResponse.json(
    { success: false, message: "Validation failed", issues },
    { status: 400 }
  );
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export function clientError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}
