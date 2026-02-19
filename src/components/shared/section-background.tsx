"use client";

import { usePathname } from "@/i18n/navigation";

const sectionHues: Record<string, number> = {
  "/dashboard": 105,
  "/clients": 200,
  "/exercises": 270,
  "/routines": 35,
  "/messages": 210,
  "/calendar": 170,
  "/settings": 240,
};

export function SectionBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sectionKey = Object.keys(sectionHues).find(
    (key) => pathname === key || pathname.startsWith(key + "/")
  );
  const hue = sectionKey ? sectionHues[sectionKey] : 105;

  return (
    <div
      className="flex-1 flex flex-col mesh-gradient-bg min-h-0"
      style={{ "--section-hue": hue } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
