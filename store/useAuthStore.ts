import { create } from "zustand";
import { UserResponse } from "@/types/user.types";

interface AuthState {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearSession: () => set({ user: null }),
}));
