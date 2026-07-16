import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Settings } from "@/types/settings.types";

interface PreferencesState extends Settings {
  hydrate: (prefs: Partial<Settings>) => void;
  setMaskBalance: (v: boolean) => void;
  setBaseCurrency: (v: string) => void;
  setSpendLimit: (v: number) => void;
  setAutoReport: (v: boolean) => void;
  setShowAlerts: (v: boolean) => void;
  reset: () => void;
}

const DEFAULT_PREFS: Settings = {
  mask_balance: false,
  baseCurrency: "USD",
  spend_limit: 0,
  auto_report: false,
  show_alerts: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFS,

      hydrate: (prefs) => set((state) => ({ ...state, ...prefs })),

      setMaskBalance: (v) => {
        set({ mask_balance: v });
        if (typeof window !== "undefined") {
          import("@/services/client/preferences.services").then(({ preferencesService }) =>
            preferencesService.update({ mask_balance: v }).catch(console.error)
          );
        }
      },

      setBaseCurrency: (v) => {
        set({ baseCurrency: v });
        if (typeof window !== "undefined") {
          import("@/services/client/preferences.services").then(({ preferencesService }) =>
            preferencesService.update({ baseCurrency: v }).catch(console.error)
          );
        }
      },

      setSpendLimit: (v) => {
        set({ spend_limit: v });
        if (typeof window !== "undefined") {
          import("@/services/client/preferences.services").then(({ preferencesService }) =>
            preferencesService.update({ spend_limit: v }).catch(console.error)
          );
        }
      },

      setAutoReport: (v) => {
        set({ auto_report: v });
        if (typeof window !== "undefined") {
          import("@/services/client/preferences.services").then(({ preferencesService }) =>
            preferencesService.update({ auto_report: v }).catch(console.error)
          );
        }
      },

      setShowAlerts: (v) => set({ show_alerts: v }),

      reset: () => set(DEFAULT_PREFS),
    }),
    {
      name: "cashflow-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mask_balance: state.mask_balance,
        baseCurrency: state.baseCurrency,
        spend_limit: state.spend_limit,
        auto_report: state.auto_report,
        show_alerts: state.show_alerts,
      }),
    }
  )
);