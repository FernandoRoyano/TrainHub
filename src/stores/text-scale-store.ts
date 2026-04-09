import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TextScale = "small" | "normal" | "large" | "xlarge";

interface TextScaleState {
  scale: TextScale;
  setScale: (scale: TextScale) => void;
}

export const SCALE_VALUES: Record<TextScale, number> = {
  small: 0.9,
  normal: 1,
  large: 1.15,
  xlarge: 1.3,
};

export const useTextScaleStore = create<TextScaleState>()(
  persist(
    (set) => ({
      scale: "normal",
      setScale: (scale) => {
        set({ scale });
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty(
            "--text-scale",
            String(SCALE_VALUES[scale])
          );
        }
      },
    }),
    {
      name: "trainhub-text-scale",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.style.setProperty(
            "--text-scale",
            String(SCALE_VALUES[state.scale])
          );
        }
      },
    }
  )
);
