"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Smartphone,
  CreditCard,
  BarChart3,
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
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
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
    color: "text-blue-400",
    bg: "bg-blue-400/10",
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
    color: "text-amber-400",
    bg: "bg-amber-400/10",
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
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export function Features() {
  const t = useTranslations("landing");

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {t("featuresLabel")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("featuresTitle")}
          </h2>
        </motion.div>

        <div className="space-y-20 md:space-y-32">
          {featureConfigs.map((feature, i) => {
            const reversed = i % 2 !== 0;
            const Icon = feature.icon;
            const bullets = feature.bulletKeys.map((key) => t(key));

            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-16`}
              >
                {/* Visual */}
                <div className="flex-1 w-full">
                  <div className="rounded-xl border border-border/50 bg-card/50 p-8 md:p-12">
                    <div className={`h-16 w-16 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex items-start gap-2 p-3 rounded-lg bg-background/50 border border-border/30"
                        >
                          <Check className={`h-4 w-4 ${feature.color} shrink-0 mt-0.5`} />
                          <span className="text-xs text-muted-foreground">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {t(feature.subtitleKey)}
                  </p>
                  <ul className="space-y-3 pt-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full ${feature.bg} flex items-center justify-center shrink-0`}>
                          <Check className={`h-3.5 w-3.5 ${feature.color}`} />
                        </div>
                        <span className="text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
