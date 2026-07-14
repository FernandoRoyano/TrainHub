"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
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
  UtensilsCrossed,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Shield,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

interface NavItem {
  key: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey: "pendingClients" | "unreadMessages" | null;
}

interface NavGroup {
  key: string;
  icon: typeof LayoutDashboard;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const navEntries: NavEntry[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard, badgeKey: null },
  { key: "clients", href: "/clients", icon: Users, badgeKey: "pendingClients" },
  { key: "messages", href: "/messages", icon: MessageSquare, badgeKey: "unreadMessages" },
  {
    key: "training",
    icon: Dumbbell,
    children: [
      { key: "exercises", href: "/exercises", icon: Dumbbell, badgeKey: null },
      { key: "blocks", href: "/blocks", icon: Dumbbell, badgeKey: null },
      { key: "routines", href: "/routines", icon: Dumbbell, badgeKey: null },
      { key: "templates", href: "/templates", icon: Dumbbell, badgeKey: null },
    ],
  },
  { key: "nutrition", href: "/nutrition", icon: UtensilsCrossed, badgeKey: null },
  {
    key: "coaching",
    icon: Briefcase,
    children: [
      { key: "questionnaires", href: "/questionnaires", icon: Briefcase, badgeKey: null },
      { key: "serviceTiers", href: "/service-tiers", icon: Briefcase, badgeKey: null },
      { key: "coachingPlans", href: "/coaching-plans", icon: Briefcase, badgeKey: null },
    ],
  },
  { key: "calendar", href: "/calendar", icon: CalendarDays, badgeKey: null },
  { key: "analytics", href: "/analytics", icon: BarChart3, badgeKey: null },
  { key: "settings", href: "/settings", icon: Settings, badgeKey: null },
  { key: "help", href: "/help", icon: HelpCircle, badgeKey: null },
];

export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { profile, signOut, isSigningOut, isAdmin } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { data: badges } = useSidebarBadges();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Auto-open group if current path matches a child
  const isChildActive = (group: NavGroup) =>
    group.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TH";

  function renderItem(item: NavItem, nested = false) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    const Icon = item.icon;
    const badgeCount = item.badgeKey && badges ? badges[item.badgeKey] : 0;

    return (
      <Link
        key={item.key}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative",
          isActive
            ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-full before:bg-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          !sidebarOpen && "justify-center px-2",
          nested && sidebarOpen && "pl-10 text-xs"
        )}
      >
        {!nested && (
          <span className="relative shrink-0">
            <Icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
            {badgeCount > 0 && !sidebarOpen && (
              <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-destructive" />
            )}
          </span>
        )}
        {nested && sidebarOpen && (
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isActive ? "bg-primary" : "bg-muted-foreground/40")} />
        )}
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
  }

  function renderGroup(group: NavGroup) {
    const isOpen = openGroups[group.key] || isChildActive(group);
    const hasActive = isChildActive(group);
    const Icon = group.icon;

    return (
      <div key={group.key}>
        <button
          onClick={() => sidebarOpen && toggleGroup(group.key)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            hasActive
              ? "text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
            !sidebarOpen && "justify-center px-2"
          )}
        >
          <Icon className={cn("h-[18px] w-[18px] shrink-0", hasActive && "text-primary")} />
          {sidebarOpen && (
            <>
              <span className="flex-1 text-left">{t(group.key)}</span>
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </>
          )}
        </button>
        {sidebarOpen && isOpen && (
          <div className="mt-0.5 space-y-0.5">
            {group.children.map((child) => renderItem(child, true))}
          </div>
        )}
      </div>
    );
  }

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
            <h2 className="font-display text-lg font-bold tracking-tight">
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
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 mb-2 border border-primary/20 bg-primary/5",
              "text-primary hover:bg-primary/10",
              !sidebarOpen && "justify-center px-2"
            )}
          >
            <Shield className="h-[18px] w-[18px] shrink-0" />
            {sidebarOpen && <span className="flex-1">Admin</span>}
          </Link>
        )}
        {navEntries.map((entry) =>
          isGroup(entry) ? renderGroup(entry) : renderItem(entry)
        )}
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
