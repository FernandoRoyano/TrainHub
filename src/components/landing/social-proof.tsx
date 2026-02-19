"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metricConfigs.map((metric, i) => (
            <motion.div
              key={metric.labelKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <metric.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(metric.labelKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
