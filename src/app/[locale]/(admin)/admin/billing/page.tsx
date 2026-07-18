"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAdminSubscriptions, useStripeHealth } from "@/hooks/use-admin";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Search,
  Users,
  UserCheck,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { BillingClass } from "@/services/admin.service";

const statusVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  active: "success",
  trialing: "info",
  past_due: "warning",
  unpaid: "warning",
  incomplete: "warning",
  canceled: "secondary",
};

function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminBillingPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const tc = useTranslations("common");
  const dfLocale = locale === "es" ? es : enUS;

  const health = useStripeHealth();
  const subs = useAdminSubscriptions();

  const [filter, setFilter] = useState<"all" | BillingClass>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const healthLabel = (key: string): string => {
    const map: Record<string, string> = {
      secret_key: t("health.secretKey"),
      webhook_secret: t("health.webhookSecret"),
      portal_config: t("health.portalConfig"),
      api_connection: t("health.apiConnection"),
      STRIPE_PRICE_PRO_MONTHLY: t("health.priceProMonthly"),
      STRIPE_PRICE_PRO_YEARLY: t("health.priceProYearly"),
      STRIPE_PRICE_ELITE_MONTHLY: t("health.priceEliteMonthly"),
      STRIPE_PRICE_ELITE_YEARLY: t("health.priceEliteYearly"),
    };
    return map[key] ?? key;
  };

  const statusLabels: Record<string, string> = {
    active: t("status.active"),
    trialing: t("status.trialing"),
    past_due: t("status.past_due"),
    unpaid: t("status.unpaid"),
    incomplete: t("status.incomplete"),
    canceled: t("status.canceled"),
  };
  const statusLabel = (status: string | null): string =>
    status ? statusLabels[status] ?? status : t("status.none");

  const trainers = useMemo(() => subs.data?.trainers ?? [], [subs.data]);
  const summary = subs.data?.summary;

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return trainers.filter((tr) => {
      if (filter !== "all" && tr.billingClass !== filter) return false;
      if (q) {
        const hay = `${tr.full_name ?? ""} ${tr.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [trainers, filter, debouncedSearch]);

  const stripeCustomerUrl = (customerId: string) => {
    const modePrefix = health.data?.mode === "test" ? "test/" : "";
    return `https://dashboard.stripe.com/${modePrefix}customers/${customerId}`;
  };

  const summaryTiles: { key: BillingClass | "total"; label: string; value: number; icon: typeof Users; className: string }[] = [
    { key: "paid", label: t("summaryPaid"), value: summary?.paid ?? 0, icon: CheckCircle2, className: "text-success bg-success/10" },
    { key: "free", label: t("summaryFree"), value: summary?.free ?? 0, icon: Users, className: "text-muted-foreground bg-muted" },
    { key: "problem", label: t("summaryProblem"), value: summary?.problem ?? 0, icon: XCircle, className: "text-warning bg-warning/10" },
    { key: "total", label: t("summaryTotal"), value: summary?.total ?? 0, icon: UserCheck, className: "text-primary bg-primary/10" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">{t("billingTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("billingSubtitle")}</p>
      </div>

      {/* Stripe health */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              {t("stripeHealth")}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => health.refetch()}
              disabled={health.isFetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${health.isFetching ? "animate-spin" : ""}`} />
              {t("recheck")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {health.isLoading ? (
            <Skeleton className="h-40" />
          ) : health.isError || !health.data ? (
            <p className="text-sm text-destructive">{t("healthProblem")}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={health.data.ok ? "success" : "warning"} className="gap-1">
                  {health.data.ok ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {health.data.ok ? t("healthOperational") : t("healthProblem")}
                </Badge>
                <Badge variant={health.data.mode === "live" ? "info" : "secondary"}>
                  {health.data.mode === "live" ? t("liveMode") : t("testMode")}
                </Badge>
                <Badge variant={health.data.paymentsEnabled ? "success" : "secondary"}>
                  {health.data.paymentsEnabled ? t("paymentsEnabled") : t("paymentsDisabled")}
                </Badge>
              </div>

              <div className="divide-y divide-border/50 rounded-lg border border-border/50">
                {health.data.checks.map((c) => (
                  <div key={c.key} className="flex items-start gap-2 px-3 py-2">
                    {c.ok ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
                    ) : (
                      <XCircle
                        className={`h-4 w-4 shrink-0 mt-0.5 ${c.critical ? "text-destructive" : "text-warning"}`}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{healthLabel(c.key)}</p>
                      <p className="text-xs text-muted-foreground break-words">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {health.data.lastWebhook
                  ? t("lastWebhook", {
                      type: health.data.lastWebhook.type,
                      ago: formatDistanceToNow(new Date(health.data.lastWebhook.receivedAt), {
                        addSuffix: true,
                        locale: dfLocale,
                      }),
                    })
                  : t("noWebhookYet")}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryTiles.map((tile) => {
          const Icon = tile.icon;
          const clickable = tile.key !== "total";
          return (
            <button
              key={tile.key}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && setFilter(tile.key as BillingClass)}
              className={`text-left ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <Card
                className={`border-border/50 transition-all ${
                  clickable && filter === tile.key ? "ring-2 ring-primary" : ""
                } ${clickable ? "hover:border-primary/40" : ""}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${tile.className}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold tabular-nums leading-none">{tile.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground truncate">{tile.label}</p>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tc("search") + "..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "paid", "free", "problem"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setFilter(f)}
            >
              {t(`filter${f.charAt(0).toUpperCase()}${f.slice(1)}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Platform revenue line */}
      {summary && (summary.revenueTotal > 0 || summary.revenueThisMonth > 0) && (
        <p className="text-sm text-muted-foreground">
          {t("platformRevenue", {
            month: formatCurrency(summary.revenueThisMonth),
            total: formatCurrency(summary.revenueTotal),
          })}
        </p>
      )}

      {/* Trainers table */}
      {subs.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              <div className="hidden md:grid grid-cols-[1fr_80px_150px_150px_70px] gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                <span>{t("colTrainer")}</span>
                <span>{t("colClients")}</span>
                <span>{t("colSubscription")}</span>
                <span>{t("colRevenue")}</span>
                <span>{t("colStripe")}</span>
              </div>

              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {tc("noResults")}
                </div>
              ) : (
                filtered.map((tr) => (
                  <div
                    key={tr.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_80px_150px_150px_70px] gap-2 md:gap-4 px-4 py-3 items-center"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tr.full_name || "---"}</p>
                      <p className="text-xs text-muted-foreground truncate">{tr.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="tabular-nums font-medium">{tr.clientCount}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex flex-wrap items-center gap-1">
                        {tr.tier && tr.tier !== "free" ? (
                          <Badge variant="secondary" className="capitalize">
                            {tr.tier}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Free</span>
                        )}
                        {tr.status && (
                          <Badge variant={statusVariant[tr.status] ?? "secondary"}>
                            {statusLabel(tr.status)}
                          </Badge>
                        )}
                      </div>
                      {tr.current_period_end && (
                        <span className="text-[11px] text-muted-foreground">
                          {tr.cancel_at_period_end
                            ? t("cancelsOn", {
                                date: format(new Date(tr.current_period_end), "d MMM yyyy", {
                                  locale: dfLocale,
                                }),
                              })
                            : t("renewsOn", {
                                date: format(new Date(tr.current_period_end), "d MMM yyyy", {
                                  locale: dfLocale,
                                }),
                              })}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      {tr.revenueTotal > 0 ? (
                        <>
                          <p className="text-sm font-semibold tabular-nums">
                            {formatCurrency(tr.revenueThisMonth)}{" "}
                            <span className="text-[11px] font-normal text-muted-foreground">
                              {t("thisMonth")}
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground tabular-nums">
                            {formatCurrency(tr.revenueTotal)} {t("totalLabel")}
                          </p>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("noRevenue")}</span>
                      )}
                    </div>
                    <div>
                      {tr.stripe_customer_id ? (
                        <a
                          href={stripeCustomerUrl(tr.stripe_customer_id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Stripe
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
