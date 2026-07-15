import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserResponse } from "@/types/user.types";
import { UserProfile } from "@/types/profile.types";

export interface AuthState {
  user: UserResponse | null;
  profile: UserProfile | null;
  hasHydrated: boolean;
  setUser: (user: UserResponse) => void;
  setProfile: (profile: UserProfile) => void;
  setHasHydrated: (value: boolean) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clearSession: () => set({ user: null, profile: null }),
      logout: async () => {
        try {
          await fetch("/api/v1/logout", { method: "POST" });
        } finally {
          set({ user: null, profile: null });
        }
      },
    }),
    {
      name: "cashflow-auth",
      partialize: (state) => ({ user: state.user, profile: state.profile }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);