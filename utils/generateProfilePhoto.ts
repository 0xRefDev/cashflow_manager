import { seeds } from "@/utils/ProfilePhotoSeeds";

const DICEBEAR_BASE_URL = "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=";

export function generateProfilePhoto(): string {
  const seed = seeds[Math.floor(Math.random() * seeds.length)].trim();
  return `${DICEBEAR_BASE_URL}${seed}`;
}
