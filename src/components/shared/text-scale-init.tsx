"use client";

import { useEffect } from "react";
import { useTextScaleStore, SCALE_VALUES } from "@/stores/text-scale-store";

/**
 * Mounts on app load and applies the persisted text-scale value
 * to the root element via CSS variable. Does not render anything.
 */
export function TextScaleInit() {
  const scale = useTextScaleStore((s) => s.scale);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--text-scale",
      String(SCALE_VALUES[scale])
    );
  }, [scale]);

  return null;
}
