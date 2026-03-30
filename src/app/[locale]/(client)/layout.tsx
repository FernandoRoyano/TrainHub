"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Dumbbell, UtensilsCrossed, BarChart3, Ruler, MessageCircle, User, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationProgress } from "@/components/shared/navigation-progress";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { ClientFeaturesProvider, useClientFeatures } from "@/contexts/client-features-context";
import { isFeatureEnabled } from "@/lib/feature-gate";
import type { FeatureKey } from "@/lib/validations/service-tier";
import { toast } from "sonner";

const navItems: {
  href: string;
  icon: typeof Dumbbell;
  labelKey: string;
  featureKey?: FeatureKey;
}[] = [
  { href: "/my-plan", icon: ClipboardList, labelKey: "myPlan" },
  { href: "/my-routine", icon: Dumbbell, labelKey: "myRoutine", featureKey: "training" },
  { href: "/my-nutrition", icon: UtensilsCrossed, labelKey: "myNutrition", featureKey: "nutrition" },
  { href: "/my-progress", icon: BarChart3, labelKey: "myProgress", featureKey: "progress_tracking" },
  { href: "/my-measurements", icon: Ruler, labelKey: "myMeasurements", featureKey: "measurements" },
  { href: "/my-messages", icon: MessageCircle, labelKey: "myMessages", featureKey: "messaging" },
  { href: "/my-profile", icon: User, labelKey: "myProfile" },
];

function ClientNavBar() {
  const t = useTranslations("nav");
  const tClient = useTranslations("clientApp");
  const pathname = usePathname();
  const { features } = useClientFeatures();

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(tClient("featureNotIncluded"));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-xl z-50 safe-area-bottom">
      <div className="flex justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          const enabled = !item.featureKey || isFeatureEnabled(features, item.featureKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={!enabled ? handleDisabledClick : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
                !enabled && "opacity-40 pointer-events-auto"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
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
