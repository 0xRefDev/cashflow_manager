import { create } from "zustand";

interface SetupStep1 {
  gender: string;
  currency: string;
  country: string;
  birthday: string;
}

interface SetupStore {
  step1: SetupStep1 | null;
  setStep1: (data: SetupStep1) => void;
  clear: () => void;
}

export const useSetupStore = create<SetupStore>((set) => ({
  step1: null,
  setStep1: (data) => set({ step1: data }),
  clear: () => set({ step1: null }),
}));
