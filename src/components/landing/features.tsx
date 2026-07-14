"use client";

import { useTranslations } from "next-intl";
import {
  ClipboardList,
  Smartphone,
  CreditCard,
  BarChart3,
  UtensilsCrossed,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureConfig {
  icon: LucideIcon;
  titleKey: string;
  subtitleKey: string;
  bulletKeys: string[];
  color: string;
  bg: string;
}

const featureConfigs: FeatureConfig[] = [
  {
    icon: ClipboardList,
    titleKey: "featureRoutinesTitle",
    subtitleKey: "featureRoutinesSubtitle",
    bulletKeys: [
      "featureRoutinesBullet1",
      "featureRoutinesBullet2",
      "featureRoutinesBullet3",
      "featureRoutinesBullet4",
    ],
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    icon: UtensilsCrossed,
    titleKey: "featureNutritionTitle",
    subtitleKey: "featureNutritionSubtitle",
    bulletKeys: [
      "featureNutritionBullet1",
      "featureNutritionBullet2",
      "featureNutritionBullet3",
      "featureNutritionBullet4",
    ],
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: Smartphone,
    titleKey: "featureClientAppTitle",
    subtitleKey: "featureClientAppSubtitle",
    bulletKeys: [
      "featureClientAppBullet1",
      "featureClientAppBullet2",
      "featureClientAppBullet3",
      "featureClientAppBullet4",
    ],
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: CreditCard,
    titleKey: "featurePaymentsTitle",
    subtitleKey: "featurePaymentsSubtitle",
    bulletKeys: [
      "featurePaymentsBullet1",
      "featurePaymentsBullet2",
      "featurePaymentsBullet3",
      "featurePaymentsBullet4",
    ],
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    icon: BarChart3,
    titleKey: "featureTrackingTitle",
    subtitleKey: "featureTrackingSubtitle",
    bulletKeys: [
      "featureTrackingBullet1",
      "featureTrackingBullet2",
      "featureTrackingBullet3",
      "featureTrackingBullet4",
    ],
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

export function Features() {
  const t = useTranslations("landing");

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal-on-scroll">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {t("featuresLabel")}
          </p>
          <h2 className="text-fluid-4xl font-bold">
            {t("featuresTitle")}
          </h2>
        </div>

        <div className="space-y-20 md:space-y-32">
          {featureConfigs.map((feature, i) => {
            const reversed = i % 2 !== 0;
            const Icon = feature.icon;
            const bullets = feature.bulletKeys.map((key) => t(key));

            return (
              <div
                key={feature.titleKey}
                className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16 reveal-on-scroll`}
              >
                {/* Visual */}
                <div className="flex-1 w-full group">
                  <div className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-card/30 p-8 md:p-12 flex flex-col items-center justify-center min-h-[260px] overflow-hidden transition-all duration-500 group-hover:border-primary/30">
                    <div
                      className={`absolute -top-16 -right-16 h-48 w-48 rounded-full ${feature.bg} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700`}
                      aria-hidden
                    />
                    <div
                      className={`relative h-20 w-20 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 ring-1 ring-inset ring-white/5 shadow-lg group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500`}
                    >
                      <Icon className={`h-10 w-10 ${feature.color}`} />
                    </div>
                    <h4 className="relative text-fluid-lg font-semibold text-center">
                      {t(feature.titleKey)}
                    </h4>
                    <p className="relative text-fluid-sm text-muted-foreground text-center mt-2 max-w-sm">
                      {t(feature.subtitleKey)}
                    </p>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-fluid-3xl font-bold leading-tight">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-fluid-lg">
                    {t(feature.subtitleKey)}
                  </p>
                  <ul className="space-y-3 pt-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full ${feature.bg} flex items-center justify-center shrink-0`}>
                          <Check className={`h-3.5 w-3.5 ${feature.color}`} />
                        </div>
                        <span className="text-fluid-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
