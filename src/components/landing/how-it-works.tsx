"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { UserPlus, Settings, Smartphone, Banknote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stepIcons: LucideIcon[] = [UserPlus, Settings, Smartphone, Banknote];
const stepNumbers = ["01", "02", "03", "04"];

export function HowItWorks() {
  const t = useTranslations("landing");

  const steps = stepIcons.map((icon, i) => ({
    icon,
    number: stepNumbers[i],
    title: t(`step${i + 1}Title`),
    description: t(`step${i + 1}Desc`),
  }));

  return (
    <section className="py-20 md:py-28 bg-card/30 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {t("howItWorksLabel")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("howItWorksTitle")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-xl border border-border/50 bg-background/50 text-center group hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
