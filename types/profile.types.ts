export interface UserProfile {
  fullname: string;
  username: string;
  country: string;
  profile_photo: string | null;
  description: string;
  verified: boolean;
  reputation: string;
  occupation?: string;
  createdAt: string;
}

export interface UpdateProfileData {
  fullname?: string;
  username?: string;
  country?: string;
  occupation?: string;
  description?: string;
}