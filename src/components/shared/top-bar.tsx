"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell } from "./notification-bell";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const routeLabels: Array<[string, string]> = [
    ["/dashboard", "dashboard"],
    ["/action-center", "actionCenter"],
    ["/clients", "clients"],
    ["/routines", "routines"],
    ["/exercises", "exercises"],
    ["/blocks", "blocks"],
    ["/templates", "templates"],
    ["/nutrition", "nutrition"],
    ["/messages", "messages"],
    ["/calendar", "calendar"],
    ["/analytics", "analytics"],
    ["/settings", "settings"],
    ["/help", "help"],
  ];
  const currentLabel = routeLabels.find(([route]) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const resolvedTitle = title ?? (currentLabel ? t(currentLabel[1]) : "TrainHub");

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 px-4 glass-topbar sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-primary" />
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("workspace")}</p>
          <p className="truncate text-sm font-semibold">{resolvedTitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
