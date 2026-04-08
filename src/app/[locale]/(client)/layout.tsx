"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Dumbbell,
  UtensilsCrossed,
  MessageCircle,
  ClipboardList,
  MoreHorizontal,
  BarChart3,
  Ruler,
  User,
  Timer,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationProgress } from "@/components/shared/navigation-progress";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { ClientFeaturesProvider, useClientFeatures } from "@/contexts/client-features-context";
import { useMyClient } from "@/hooks/use-client-app";
import { isFeatureEnabled } from "@/lib/feature-gate";
import type { FeatureKey } from "@/lib/validations/service-tier";
import { toast } from "sonner";

interface NavItem {
  href: string;
  icon: typeof Dumbbell;
  labelKey: string;
  featureKey?: FeatureKey;
}

const mainNavItems: NavItem[] = [
  { href: "/my-plan", icon: ClipboardList, labelKey: "myPlan" },
  { href: "/my-routine", icon: Dumbbell, labelKey: "myRoutine", featureKey: "training" },
  { href: "/my-nutrition", icon: UtensilsCrossed, labelKey: "myNutrition", featureKey: "nutrition" },
  { href: "/my-messages", icon: MessageCircle, labelKey: "myMessages", featureKey: "messaging" },
  { href: "/my-fasting", icon: Timer, labelKey: "myFasting" },
];

const moreNavItems: NavItem[] = [
  { href: "/my-progress", icon: BarChart3, labelKey: "myProgress", featureKey: "progress_tracking" },
  { href: "/my-measurements", icon: Ruler, labelKey: "myMeasurements", featureKey: "measurements" },
  { href: "/my-cycle", icon: Heart, labelKey: "myCycle" },
  { href: "/my-profile", icon: User, labelKey: "myProfile" },
];

function ClientNavBar() {
  const t = useTranslations("nav");
  const tClient = useTranslations("clientApp");
  const pathname = usePathname();
  const { features } = useClientFeatures();
  const { data: myClient } = useMyClient();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(tClient("featureNotIncluded"));
  };

  const filteredMoreNavItems = moreNavItems.filter((item) => {
    if (item.href === "/my-cycle" && myClient?.gender !== "female") return false;
    return true;
  });

  const isMoreActive = filteredMoreNavItems.some((item) => pathname.includes(item.href));

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute bottom-16 md:bottom-20 left-0 right-0 bg-card border-t border-border/50 shadow-xl px-1 py-2.5 animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-around max-w-2xl mx-auto">
              {filteredMoreNavItems.map((item) => {
                const isActive = pathname.includes(item.href);
                const enabled = !item.featureKey || isFeatureEnabled(features, item.featureKey);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      if (!enabled) {
                        handleDisabledClick(e);
                        return;
                      }
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 py-1.5 px-3 md:px-5 rounded-lg transition-all active:scale-95",
                      isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent",
                      !enabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 md:h-6 md:w-6", isActive && "text-primary")} />
                    <span className="text-[11px] md:text-xs font-medium leading-tight">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="shrink-0 border-t border-border/50 bg-card/95 backdrop-blur-xl z-50">
        <div className="flex justify-around py-2 md:py-3 px-1 max-w-2xl mx-auto">
          {mainNavItems.map((item) => {
            const isActive = pathname.includes(item.href);
            const enabled = !item.featureKey || isFeatureEnabled(features, item.featureKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={!enabled ? handleDisabledClick : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 px-3 md:px-5 rounded-lg transition-all active:scale-95",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  !enabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <item.icon className={cn("h-5 w-5 md:h-6 md:w-6 transition-colors", isActive && "text-primary")} />
                <span className="text-[11px] md:text-xs font-medium leading-tight">{t(item.labelKey)}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 px-3 md:px-5 rounded-lg transition-all active:scale-95",
              moreOpen || isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MoreHorizontal className={cn("h-5 w-5 md:h-6 md:w-6 transition-transform", moreOpen && "rotate-90")} />
            <span className="text-[11px] md:text-xs font-medium leading-tight">{t("more")}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientFeaturesProvider>
      <div className="h-dvh flex flex-col overflow-hidden">
        <NavigationProgress />
        <header className="shrink-0 z-40 flex items-center justify-end h-12 md:h-14 px-4 md:px-8 gap-2">
          <NotificationBell />
          <ThemeToggle />
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 md:px-8 md:pt-6 md:pb-10">
          <div className="max-w-4xl mx-auto w-full">{children}</div>
        </main>
        <ClientNavBar />
      </div>
    </ClientFeaturesProvider>
  );
}
