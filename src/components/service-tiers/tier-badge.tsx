"use client";

import { cn } from "@/lib/utils";

interface TierBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

export function TierBadge({ name, color, size = "sm" }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium text-white",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
      )}
      style={{ backgroundColor: color || "#6b7280" }}
    >
      {name}
    </span>
  );
}
