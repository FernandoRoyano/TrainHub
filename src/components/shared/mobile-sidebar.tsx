"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  MessageSquare,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "clients", href: "/clients", icon: Users },
  { key: "exercises", href: "/exercises", icon: Dumbbell },
  { key: "routines", href: "/routines", icon: ClipboardList },
  { key: "messages", href: "/messages", icon: MessageSquare },
  { key: "calendar", href: "/calendar", icon: CalendarDays },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export function MobileSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { profile, signOut, isSigningOut, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TH";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 border-r border-border/50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-5 h-16">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">
              Train<span className="text-primary">Hub</span>
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
                  <span>{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="px-3 py-3 border-t border-border/50">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || "Entrenador"}
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
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              disabled={isSigningOut}
              className="w-full mt-1 justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
