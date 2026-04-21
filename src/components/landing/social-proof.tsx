"use client";

import { useTranslations } from "next-intl";
import { Users, Dumbbell, BarChart3, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const metricConfigs: { icon: LucideIcon; value: string; labelKey: string }[] = [
  { icon: Users, value: "500+", labelKey: "metricTrainers" },
  { icon: Dumbbell, value: "10,000+", labelKey: "metricRoutines" },
  { icon: BarChart3, value: "50,000+", labelKey: "metricWorkouts" },
  { icon: Star, value: "4.9", labelKey: "metricRating" },
];

export function SocialProof() {
  const t = useTranslations("landing");

  return (
    <section className="py-16 border-y border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {metricConfigs.map((metric) => (
            <div key={metric.labelKey} className="text-center reveal-on-scroll">
              <metric.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="text-fluid-3xl font-bold tabular-nums">{metric.value}</p>
              <p className="text-fluid-sm text-muted-foreground mt-1">
                {t(metric.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
