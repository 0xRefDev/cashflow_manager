import "server-only";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Wallet from "@/models/Wallets";

import { UserProfile } from "@/types/profile.types";

export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    if (!userId) throw new Error("Invalid request");

    const [user, profile] = await Promise.all([
      User.findById(userId).select('username fullname').lean(),
      Profile.findOne({ userId }).select('description country profile_photo verified reputation createdAt occupation').lean(),
    ]);

    if (!user || !profile) throw new Error("User or profile not found");

    return {
      username: user.username,
      fullname: user.fullname,
      description: profile.description || "",
      country: profile.country || "Not specified",
      occupation: profile.occupation || "",
      profile_photo: profile.profile_photo || null,
      verified: profile.verified ?? false,
      reputation: profile.reputation ?? 0,
      createdAt: profile.createdAt,
    };
} catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

export async function getFinancialPulse(userId: string) {
  const wallets = await Wallet.find({ userId }).lean();

  const netWorth = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  if (wallets.length === 0) {
    return { net_worth: 0, avg_growth_pct: 0 };
  }

  const avgGrowth = 0;

  return {
    net_worth: netWorth,
    avg_growth_pct: avgGrowth
  };
}

export async function updateProfile(userId: string, updateData: Partial<UserProfile>) {
  try {
    if (!userId) throw new Error("Invalid request");

    const { _id, userId: forbidden, verified, reputation, ...allowedData } = updateData as any;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { $set: allowedData },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    if (!updatedProfile) throw new Error("Profile not found");

    const user = await User.findById(userId).select('username fullname').lean();

    return {
      username: user.username,
      fullname: user.fullname,
      description: updatedProfile.description || "",
      occupation: updatedProfile.occupation || "",
      country: updatedProfile.country || "Not specified",
      profile_photo: updatedProfile.profile_photo || null,
      verified: updatedProfile.verified ?? false,
      reputation: updatedProfile.reputation ?? 0,
      createdAt: updatedProfile.createdAt
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    throw new Error(errorMessage);
  }
}