import { Settings } from "@/types/settings.types";

export const preferencesService = {
  async update(data: Settings): Promise<Settings> {
    const res = await fetch("/api/v1/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update preferences");
    const json = await res.json();
    return json.preferences;
  }
};

export const getPreferences = async (): Promise<Settings> => {
  const res = await fetch("/api/v1/preferences");
  if (!res.ok) throw new Error("Failed to fetch preferences");
  const json = await res.json();
  return json.preferences;
};