"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  House,
  Dumbbell,
  UtensilsCrossed,
  MessageCircle,
  MoreHorizontal,
  BarChart3,
  Ruler,
  User,
  Timer,
  Heart,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationProgress } from "@/components/shared/navigation-progress";
import { PageTransition } from "@/components/shared/page-transition";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { InstallPrompt } from "@/components/shared/install-prompt";
import { ClientFeaturesProvider, useClientFeatures } from "@/contexts/client-features-context";
import { useMyClient } from "@/hooks/use-client-app";
import { useHeartbeat } from "@/hooks/use-heartbeat";
import { isFeatureEnabled } from "@/lib/feature-gate";
import type { FeatureKey } from "@/lib/validations/service-tier";
import { toast } from "sonner";
import { TrainerBrand } from "@/components/shared/trainer-brand";

interface NavItem {
  href: string;
  icon: typeof Dumbbell;
  labelKey: string;
  featureKey?: FeatureKey;
}

const mainNavItems: NavItem[] = [
  { href: "/today", icon: House, labelKey: "today" },
  { href: "/my-routine", icon: Dumbbell, labelKey: "myRoutine", featureKey: "training" },
  { href: "/my-progress", icon: BarChart3, labelKey: "myProgress", featureKey: "progress_tracking" },
  { href: "/my-messages", icon: MessageCircle, labelKey: "myMessages", featureKey: "messaging" },
];

const moreNavItems: NavItem[] = [
  { href: "/my-nutrition", icon: UtensilsCrossed, labelKey: "myNutrition", featureKey: "nutrition" },
  { href: "/my-fasting", icon: Timer, labelKey: "myFasting" },
  { href: "/my-measurements", icon: Ruler, labelKey: "myMeasurements", featureKey: "measurements" },
  { href: "/my-cycle", icon: Heart, labelKey: "myCycle" },
  { href: "/my-profile", icon: User, labelKey: "myProfile" },
  { href: "/help", icon: HelpCircle, labelKey: "help" },
];

function ClientNavBar() {
  const t = useTranslations("nav");
  const tClient = useTranslations("clientApp");
  const tCommon = useTranslations("common");
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
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMoreOpen(false)}
            aria-label={tCommon("close")}
          />
          <div
            className="absolute bottom-16 left-0 right-0 bg-card border-t border-border/50 shadow-xl px-1 py-2.5 animate-in slide-in-from-bottom-4 duration-200 md:bottom-20"
            role="dialog"
            aria-label={t("more")}
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
                      "flex min-h-11 flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-[color,background-color,transform] active:scale-95 md:px-5",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
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

      {/* Bottom nav bar (safe-area para iPhone con notch) */}
      <nav className="shrink-0 border-t border-border/40 bg-background/90 backdrop-blur-2xl z-50 pb-[env(safe-area-inset-bottom)]">
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
                  "flex min-h-11 flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-[color,background-color,transform] active:scale-95 md:px-5",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
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
              "flex min-h-11 flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-[color,background-color,transform] active:scale-95 md:px-5",
              moreOpen || isMoreActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
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
  const t = useTranslations("nav");
  const { data: myClient } = useMyClient();
  useHeartbeat();
  return (
    <ClientFeaturesProvider>
      <div className="h-dvh flex flex-col overflow-hidden">
        <NavigationProgress />
        <header className="shrink-0 z-40 flex items-center justify-between h-14 px-4 md:px-8 gap-2 border-b border-border/30 bg-background/80 backdrop-blur-xl">
          <Link href="/today" aria-label="TrainHub">
            <TrainerBrand
              trainerName={myClient?.trainer?.full_name}
              avatarUrl={myClient?.trainer?.avatar_url}
              settings={myClient?.trainer?.settings}
              signature={t("poweredByTrainHub")}
            />
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 md:px-8 md:pt-6 md:pb-10">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-3">
              <InstallPrompt />
            </div>
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
        <ClientNavBar />
      </div>
    </ClientFeaturesProvider>
  );
}
