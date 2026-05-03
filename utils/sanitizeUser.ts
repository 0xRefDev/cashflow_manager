import { UserDocument, UserResponse } from "@/types/user.types";

export function sanitizeUser(user: UserDocument): UserResponse {
  return {
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
    gender: user.gender,
    completedSetup: user.completedSetup,
    verified: user.verified,
    status: user.status,
    ...(user.birthday && { birthday: user.birthday }),
    ...(user.country && { country: user.country }),
    ...(user.profile_photo && { profile_photo: user.profile_photo }),
    ...(user.occupation && { occupation: user.occupation }),
    ...(user.description && { description: user.description }),
    ...(user.currency && { currency: user.currency }),
  };
}