"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanConfig {
  nameKey: string;
  priceMonthly: number;
  priceYearly: number;
  descKey: string;
  featureKeys: string[];
  ctaKey: string;
  href: string;
  popular: boolean;
}

const planConfigs: PlanConfig[] = [
  {
    nameKey: "planFreeName",
    priceMonthly: 0,
    priceYearly: 0,
    descKey: "planFreeDesc",
    featureKeys: [
      "planFreeFeature1",
      "planFreeFeature2",
      "planFreeFeature3",
      "planFreeFeature4",
    ],
    ctaKey: "planFreeCta",
    href: "/register",
    popular: false,
  },
  {
    nameKey: "planProName",
    priceMonthly: 29,
    priceYearly: 24,
    descKey: "planProDesc",
    featureKeys: [
      "planProFeature1",
      "planProFeature2",
      "planProFeature3",
      "planProFeature4",
      "planProFeature5",
      "planProFeature6",
    ],
    ctaKey: "planProCta",
    href: "/register",
    popular: true,
  },
  {
    nameKey: "planBusinessName",
    priceMonthly: 79,
    priceYearly: 66,
    descKey: "planBusinessDesc",
    featureKeys: [
      "planBusinessFeature1",
      "planBusinessFeature2",
      "planBusinessFeature3",
      "planBusinessFeature4",
      "planBusinessFeature5",
      "planBusinessFeature6",
    ],
    ctaKey: "planBusinessCta",
    href: "/register",
    popular: false,
  },
];

export function Pricing() {
  const t = useTranslations("landing");
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {t("pricingLabel")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("pricingTitle")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("pricingSubtitle")}
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={cn(
                "text-sm",
                !yearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("pricingMonthly")}
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors",
                yearly ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
                  yearly ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm",
                yearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t("pricingYearly")}
              <Badge variant="secondary" className="ml-2 text-[10px]">
                -17%
              </Badge>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {planConfigs.map((plan, i) => (
            <motion.div
              key={plan.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-xl border p-6 md:p-8 flex flex-col",
                plan.popular
                  ? "border-primary/50 bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10"
                  : "border-border/50 bg-card/50"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {t("pricingRecommended")}
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{t(plan.nameKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(plan.descKey)}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {yearly ? plan.priceYearly : plan.priceMonthly}€
                </span>
                <span className="text-muted-foreground">
                  /{t("pricingPerMonth")}
                </span>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.featureKeys.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <Link href={plan.href}>{t(plan.ctaKey)}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
