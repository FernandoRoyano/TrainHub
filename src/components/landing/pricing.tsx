"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PLAN_PRICES } from "@/lib/stripe/plans";

interface PlanConfig {
  nameKey: string;
  tier: "free" | "pro" | "elite";
  priceMonthly: number;
  priceYearly: number;
  descKey: string;
  featureKeys: string[];
  ctaKey: string;
  popular: boolean;
}

const planConfigs: PlanConfig[] = [
  {
    nameKey: "planFreeName",
    tier: "free",
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
    popular: false,
  },
  {
    nameKey: "planProName",
    tier: "pro",
    priceMonthly: PLAN_PRICES.pro.monthly,
    priceYearly: PLAN_PRICES.pro.yearly,
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
    popular: true,
  },
  {
    nameKey: "planBusinessName",
    tier: "elite",
    priceMonthly: PLAN_PRICES.elite.monthly,
    priceYearly: PLAN_PRICES.elite.yearly,
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
    popular: false,
  },
];

export function Pricing() {
  const t = useTranslations("landing");
  const [yearly, setYearly] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleCheckout(tier: "pro" | "elite") {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval: yearly ? "yearly" : "monthly" }),
      });
      const data = await res.json();

      if (!res.ok) {
        // If not authenticated, redirect to register
        if (res.status === 401) {
          window.location.href = "/register";
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal-on-scroll">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            {t("pricingLabel")}
          </p>
          <h2 className="text-fluid-4xl font-bold mb-4">
            {t("pricingTitle")}
          </h2>
          <p className="text-muted-foreground text-fluid-base max-w-lg mx-auto">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {planConfigs.map((plan) => {
            const isLoading = loadingTier === plan.tier;
            const isFree = plan.tier === "free";

            return (
              <div
                key={plan.nameKey}
                className={cn(
                  "relative rounded-xl p-6 md:p-8 flex flex-col reveal-on-scroll",
                  plan.popular
                    ? "animated-border scale-[1.02] shadow-lg shadow-primary/20"
                    : "border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
                )}
              >
                <div className="relative z-[1] flex flex-col flex-1">
                  {plan.popular && (
                    <Badge className="absolute -top-11 left-1/2 -translate-x-1/2 shadow-lg">
                      {t("pricingRecommended")}
                    </Badge>
                  )}
                  <div className="mb-6">
                    <h3 className="text-fluid-lg font-semibold">{t(plan.nameKey)}</h3>
                    <p className="text-fluid-sm text-muted-foreground mt-1">
                      {t(plan.descKey)}
                    </p>
                  </div>
                  <div className="mb-6 flex items-end gap-1">
                    <span className="text-fluid-5xl font-bold tabular-nums">
                      {yearly ? plan.priceYearly : plan.priceMonthly}€
                    </span>
                    <span className="text-muted-foreground text-fluid-sm mb-2">
                      /{t("pricingPerMonth")}
                    </span>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.featureKeys.map((key) => (
                      <li key={key} className="flex items-center gap-2 text-fluid-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {t(key)}
                      </li>
                    ))}
                  </ul>

                  {isFree ? (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/register">{t(plan.ctaKey)}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full"
                      disabled={!!loadingTier}
                      onClick={() => handleCheckout(plan.tier as "pro" | "elite")}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t(plan.ctaKey)}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
