"use client";

import { useTranslations } from "next-intl";
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
        <div className="text-center mb-16 reveal-on-scroll">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {t("howItWorksLabel")}
          </p>
          <h2 className="text-fluid-4xl font-bold">
            {t("howItWorksTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-xl border border-border/50 bg-background/50 text-center group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 reveal-on-scroll"
              >
                <div className="text-fluid-4xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-fluid-base">{step.title}</h3>
                <p className="text-fluid-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
