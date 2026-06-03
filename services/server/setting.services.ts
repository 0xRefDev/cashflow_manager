import "server-only";

import { logger } from "@/lib/logger";
import { Settings } from "@/types/settings.types";
import Preferences from "@/models/Preferences";

export async function updatePreferences(data: Settings) {
  const { userId, ...fields } = data;

  if (!userId) throw new Error("User ID is missing.");

  const patch = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined)
  );

  if (Object.keys(patch).length === 0) throw new Error("No fields to update");

  logger.info("Updating preferences", { userId, patch });

  const updatedPreferences = await Preferences.findOneAndUpdate(
    { userId },
    { $set: patch },
    { returnDocument: "after" }
  );

  logger.info("Update result", { found: !!updatedPreferences });

  if (!updatedPreferences) throw new Error("Preferences not found");

  return updatedPreferences;
}

export async function getPreferences(userId: string) {
  if (!userId) throw new Error("User ID is missing.");

  const preferences = await Preferences.findOne({ userId }).lean();

  if (!preferences) throw new Error("Preferences not found"); 

  return preferences;
}