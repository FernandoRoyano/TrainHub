"use client";

import { usePathname } from "@/i18n/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavigationProgress } from "@/components/shared/navigation-progress";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Dumbbell,
  Shield,
  CreditCard,
} from "lucide-react";

const adminNavItems = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "billing", href: "/admin/billing", icon: CreditCard },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");
  const tn = useTranslations("nav");
  const pathname = usePathname();
  const { profile, signOut, isSigningOut } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="flex min-h-screen max-w-[100vw] overflow-x-hidden">
      <NavigationProgress />

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 glass-sidebar">
        <div className="flex items-center gap-2 px-4 h-16">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">
            Admin<span className="text-primary">Panel</span>
          </h2>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-[18px] w-[18px]", isActive(item.href) && "text-primary")} />
                <span>{t(`nav.${item.key}`)}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-border/50 mt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
            >
              <Dumbbell className="h-[18px] w-[18px]" />
              <span>{t("backToApp")}</span>
            </Link>
          </div>
        </nav>

        {/* User section */}
        <div className="px-3 py-3 border-t border-border/50">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-8 w-8 shrink-0 border border-border/50">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.full_name || "Admin"}
                <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  Admin
                </span>
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            disabled={isSigningOut}
            className="w-full mt-1 justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {tn("logout")}
          </Button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 glass-topbar">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-base font-bold tracking-tight">
              Admin<span className="text-primary">Panel</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            disabled={isSigningOut}
            className="text-muted-foreground hover:text-destructive"
            aria-label={tn("logout")}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 transition active:scale-95",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-[22px] w-[22px]" />
                <span className="text-[10px] font-medium leading-none">
                  {t(`nav.${item.key}`)}
                </span>
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-muted-foreground hover:text-foreground transition active:scale-95"
          >
            <Dumbbell className="h-[22px] w-[22px]" />
            <span className="text-[10px] font-medium leading-none">TrainHub</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
