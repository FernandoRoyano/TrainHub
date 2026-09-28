"use client";

import { usePathname } from "@/i18n/navigation";

const sectionHues: Record<string, number> = {
  "/dashboard": 105,
  "/clients": 115,
  "/exercises": 95,
  "/blocks": 100,
  "/routines": 110,
  "/messages": 125,
  "/calendar": 120,
  "/settings": 105,
};

export function SectionBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sectionKey = Object.keys(sectionHues).find(
    (key) => pathname === key || pathname.startsWith(key + "/")
  );
  const hue = sectionKey ? sectionHues[sectionKey] : 105;

  return (
    <div
      className="flex-1 flex flex-col mesh-gradient-bg min-h-0 min-w-0 overflow-x-hidden"
      style={{ "--section-hue": hue } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
