"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Dumbbell, UtensilsCrossed, BarChart3, Ruler, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationProgress } from "@/components/shared/navigation-progress";

const navItems = [
  { href: "/my-routine", icon: Dumbbell, labelKey: "myRoutine" as const },
  { href: "/my-nutrition", icon: UtensilsCrossed, labelKey: "myNutrition" as const },
  { href: "/my-progress", icon: BarChart3, labelKey: "myProgress" as const },
  { href: "/my-measurements", icon: Ruler, labelKey: "myMeasurements" as const },
  { href: "/my-messages", icon: MessageCircle, labelKey: "myMessages" as const },
  { href: "/my-profile", icon: User, labelKey: "myProfile" as const },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationProgress />
      <main className="flex-1 p-4 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-xl z-50 safe-area-bottom">
        <div className="flex justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
