import "server-only";
import Profile from "@/models/Profile";
import { generateProfilePhoto } from "@/utils/generateProfilePhoto";

export async function regenerateUserAvatar(userId: string) {
  try {
    const newAvatarUrl = generateProfilePhoto();

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: { profile_photo: newAvatarUrl } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProfile) {
      throw new Error("Profile not found");
    }

    return { profile_photo: updatedProfile.profile_photo };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error("Failed to regenerate avatar: " + errorMessage);
  }
}