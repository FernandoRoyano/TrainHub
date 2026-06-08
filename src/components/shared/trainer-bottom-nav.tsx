"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSidebarBadges } from "@/hooks/use-dashboard";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  MessageSquare,
  MoreHorizontal,
  UtensilsCrossed,
  CalendarDays,
  BarChart3,
  Settings,
  HelpCircle,
  Briefcase,
  LayoutTemplate,
  Puzzle,
  ClipboardList,
  Shield,
  LogOut,
  X,
} from "lucide-react";

type BadgeKey = "pendingClients" | "unreadMessages";

interface NavItem {
  href: string;
  icon: typeof LayoutDashboard;
  labelKey: string;
  badgeKey?: BadgeKey;
}

const mainNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/clients", icon: Users, labelKey: "clients", badgeKey: "pendingClients" },
  { href: "/routines", icon: Dumbbell, labelKey: "routines" },
  { href: "/messages", icon: MessageSquare, labelKey: "messages", badgeKey: "unreadMessages" },
];

const moreSections: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "training",
    items: [
      { href: "/exercises", icon: Dumbbell, labelKey: "exercises" },
      { href: "/blocks", icon: Puzzle, labelKey: "blocks" },
      { href: "/templates", icon: LayoutTemplate, labelKey: "templates" },
      { href: "/nutrition", icon: UtensilsCrossed, labelKey: "nutrition" },
    ],
  },
  {
    titleKey: "coaching",
    items: [
      { href: "/questionnaires", icon: ClipboardList, labelKey: "questionnaires" },
      { href: "/service-tiers", icon: Briefcase, labelKey: "serviceTiers" },
      { href: "/coaching-plans", icon: Briefcase, labelKey: "coachingPlans" },
    ],
  },
  {
    titleKey: "more",
    items: [
      { href: "/calendar", icon: CalendarDays, labelKey: "calendar" },
      { href: "/analytics", icon: BarChart3, labelKey: "analytics" },
      { href: "/settings", icon: Settings, labelKey: "settings" },
      { href: "/help", icon: HelpCircle, labelKey: "help" },
    ],
  },
];

export function TrainerBottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { profile, signOut, isSigningOut, isAdmin } = useAuth();
  const { data: badges } = useSidebarBadges();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const moreHrefs = moreSections.flatMap((s) => s.items.map((i) => i.href));
  const isMoreActive = moreHrefs.some((href) => isActive(href)) || (isAdmin && isActive("/admin"));

  const badgeFor = (key?: BadgeKey) => (key && badges ? badges[key] : 0);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TH";

  return (
    <>
      {/* More sheet */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200 md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-border/50 bg-card shadow-2xl animate-in slide-in-from-bottom duration-300 pb-[env(safe-area-inset-bottom)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {profile?.full_name || t("trainer")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent active:scale-90 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-3 pb-4 scrollbar-thin">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 mb-2 border border-primary/20 bg-primary/5 text-primary font-medium active:scale-[0.98] transition",
                  )}
                >
                  <Shield className="h-5 w-5 shrink-0" />
                  <span>Admin</span>
                </Link>
              )}
              {moreSections.map((section) => (
                <div key={section.titleKey} className="mb-3 last:mb-0">
                  <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    {t(section.titleKey)}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center transition active:scale-[0.96]",
                            active
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="text-[11px] font-medium leading-tight">
                            {t(item.labelKey)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setMoreOpen(false);
                  signOut();
                }}
                disabled={isSigningOut}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-destructive active:scale-[0.98] transition"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around px-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            const count = badgeFor(item.badgeKey);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 transition active:scale-95",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium leading-none">{t(item.labelKey)}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 transition active:scale-95",
              moreOpen || isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MoreHorizontal className="h-[22px] w-[22px]" />
            <span className="text-[10px] font-medium leading-none">{t("more")}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
