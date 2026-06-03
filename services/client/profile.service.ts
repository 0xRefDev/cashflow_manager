import { UserProfile, UpdateProfileData } from "@/types/profile.types";

export const profileService = {
  async update(data: UpdateProfileData): Promise<UserProfile> {
    const res = await fetch("/api/v1/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const json = await res.json();
    return json.profile;
  }
};