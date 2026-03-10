"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Crown, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const TIER_CONFIG = {
  free: { color: "bg-muted text-muted-foreground", icon: null },
  pro: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Crown },
  elite: { color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Crown },
} as const;

interface Subscription {
  id: string;
  tier: string;
  status: string;
  billing_interval: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
}

export function SubscriptionCard() {
  const t = useTranslations("settings");
  const searchParams = useSearchParams();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  // Show toast for subscription success/cancel from URL params
  useEffect(() => {
    const sub = searchParams.get("subscription");
    if (sub === "success") {
      toast.success(t("subscriptionSuccess"));
    } else if (sub === "cancelled") {
      toast.info(t("subscriptionCancelled"));
    }
  }, [searchParams, t]);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      return data as Subscription | null;
    },
    staleTime: 60 * 1000,
  });

  const tier = subscription?.tier || "free";
  const tierConfig = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.free;
  const isPaid = tier !== "free" && subscription?.status === "active";

  const tierLabel =
    tier === "pro" ? t("proPlan") : tier === "elite" ? t("elitePlan") : t("freePlan");

  const statusLabel =
    subscription?.status === "active"
      ? t("subscriptionActive")
      : subscription?.status === "canceled"
        ? t("subscriptionCanceled")
        : subscription?.status === "past_due"
          ? t("subscriptionPastDue")
          : subscription?.status === "trialing"
            ? t("subscriptionTrialing")
            : null;

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Error opening billing portal");
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async (upgradeTier: "pro" | "elite") => {
    setLoadingCheckout(upgradeTier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: upgradeTier, interval: "monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Error starting checkout");
    } finally {
      setLoadingCheckout(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t("subscription")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-16 animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t("subscription")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current plan info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{tierLabel}</span>
                <Badge variant="outline" className={tierConfig.color}>
                  {statusLabel || t("subscriptionActive")}
                </Badge>
              </div>
              {isPaid && subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground mt-1">
                  {subscription.cancel_at_period_end
                    ? t("cancelsOn", {
                        date: new Date(subscription.current_period_end).toLocaleDateString(),
                      })
                    : t("renewsOn", {
                        date: new Date(subscription.current_period_end).toLocaleDateString(),
                      })}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {tier === "free"
                  ? t("clientLimitFree")
                  : tier === "pro"
                    ? t("clientLimitPro")
                    : t("clientLimitElite")}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {isPaid && subscription?.stripe_customer_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              disabled={loadingPortal}
            >
              {loadingPortal ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              {t("manageBilling")}
            </Button>
          )}

          {tier === "free" && (
            <>
              <Button
                size="sm"
                onClick={() => handleUpgrade("pro")}
                disabled={!!loadingCheckout}
              >
                {loadingCheckout === "pro" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("upgradePlan")} Pro
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpgrade("elite")}
                disabled={!!loadingCheckout}
              >
                {loadingCheckout === "elite" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("upgradePlan")} Elite
              </Button>
            </>
          )}

          {tier === "pro" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpgrade("elite")}
              disabled={!!loadingCheckout}
            >
              {loadingCheckout === "elite" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("upgradePlan")} Elite
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
