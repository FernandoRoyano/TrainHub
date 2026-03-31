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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationProgress } from "@/components/shared/navigation-progress";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { ClientFeaturesProvider, useClientFeatures } from "@/contexts/client-features-context";
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
];

const moreNavItems: NavItem[] = [
  { href: "/my-progress", icon: BarChart3, labelKey: "myProgress", featureKey: "progress_tracking" },
  { href: "/my-measurements", icon: Ruler, labelKey: "myMeasurements", featureKey: "measurements" },
  { href: "/my-profile", icon: User, labelKey: "myProfile" },
];

function ClientNavBar() {
  const t = useTranslations("nav");
  const tClient = useTranslations("clientApp");
  const pathname = usePathname();
  const { features } = useClientFeatures();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(tClient("featureNotIncluded"));
  };

  const isMoreActive = moreNavItems.some((item) => pathname.includes(item.href));

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute bottom-20 left-0 right-0 bg-card border-t border-border/50 rounded-t-2xl shadow-lg p-4 safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">{t("more")}</span>
              <button onClick={() => setMoreOpen(false)} className="p-1 rounded-full hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreNavItems.map((item) => {
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
                      "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                      !enabled && "opacity-40"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 backdrop-blur-xl z-50 safe-area-bottom">
        <div className="flex justify-around py-1.5 px-1">
          {mainNavItems.map((item) => {
            const isActive = pathname.includes(item.href);
            const enabled = !item.featureKey || isFeatureEnabled(features, item.featureKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={!enabled ? handleDisabledClick : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all",
                  isActive ? "text-primary" : "text-muted-foreground",
                  !enabled && "opacity-40"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="text-[9px] font-medium leading-tight">{t(item.labelKey)}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all",
              moreOpen || isMoreActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[9px] font-medium leading-tight">{t("more")}</span>
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
      <div className="flex flex-col min-h-screen">
        <NavigationProgress />
        <header className="sticky top-0 z-40 flex items-center justify-end h-12 px-4 gap-2">
          <NotificationBell />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 pb-24">{children}</main>
        <ClientNavBar />
      </div>
    </ClientFeaturesProvider>
  );
}
