export interface UserProfile {
  fullname: string;
  username: string;
  country: string;
  profile_photo: string | null;
  description: string;
  verified: boolean;
  reputation: string;
  createdAt: string;
}