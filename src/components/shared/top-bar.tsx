"use client";

import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell } from "./notification-bell";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 glass-topbar">
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-display text-base font-bold tracking-tight">
          Train<span className="text-primary">Hub</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
