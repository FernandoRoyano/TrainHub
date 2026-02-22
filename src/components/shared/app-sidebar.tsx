"use client";

import { usePathname } from "@/i18n/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSidebarBadges } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  UtensilsCrossed,
  MessageSquare,
  CalendarDays,
  Settings,
  LogOut,
  ChevronLeft,
  Puzzle,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard, badgeKey: null },
  { key: "clients", href: "/clients", icon: Users, badgeKey: "pendingClients" as const },
  { key: "exercises", href: "/exercises", icon: Dumbbell, badgeKey: null },
  { key: "blocks", href: "/blocks", icon: Puzzle, badgeKey: null },
  { key: "routines", href: "/routines", icon: ClipboardList, badgeKey: null },
  { key: "nutrition", href: "/nutrition", icon: UtensilsCrossed, badgeKey: null },
  { key: "messages", href: "/messages", icon: MessageSquare, badgeKey: "unreadMessages" as const },
  { key: "calendar", href: "/calendar", icon: CalendarDays, badgeKey: null },
  { key: "settings", href: "/settings", icon: Settings, badgeKey: null },
] as const;

export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { profile, signOut, isSigningOut, isAdmin } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { data: badges } = useSidebarBadges();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TH";

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col glass-sidebar transition-all duration-300 scrollbar-thin",
        sidebarOpen ? "w-64" : "w-[68px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">
              Train<span className="text-primary">Hub</span>
            </h2>
          </div>
        )}
        {!sidebarOpen && (
          <Dumbbell className="h-6 w-6 text-primary mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("h-7 w-7 text-muted-foreground", !sidebarOpen && "hidden")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const badgeCount = item.badgeKey && badges ? badges[item.badgeKey] : 0;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <span className="relative shrink-0">
                <Icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
                {badgeCount > 0 && !sidebarOpen && (
                  <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </span>
              {sidebarOpen && (
                <>
                  <span className="flex-1">{t(item.key)}</span>
                  {badgeCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-3 border-t border-border/50">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-2 py-2",
            !sidebarOpen && "justify-center px-0"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 border border-border/50">
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.full_name || t("trainer")}
                {isAdmin && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Admin
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          disabled={isSigningOut}
          className={cn(
            "w-full mt-1 text-muted-foreground hover:text-destructive",
            sidebarOpen ? "justify-start" : "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span className="ml-2">{t("logout")}</span>}
        </Button>
      </div>
    </aside>
  );
}
