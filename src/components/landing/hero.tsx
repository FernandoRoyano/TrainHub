"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Users,
  Dumbbell,
  UtensilsCrossed,
  CreditCard,
  LayoutDashboard,
  TrendingUp,
  Activity,
  CircleDollarSign,
  MessageSquare,
} from "lucide-react";

export function Hero() {
  const t = useTranslations("landing");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t("heroBadge")}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            {t("heroTitle")}
            <br />
            <span className="text-primary">{t("heroTitleHighlight")}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-base px-8 h-12" asChild>
              <Link href="/register">
                {t("heroCtaPrimary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12"
              asChild
            >
              <a href="#features">{t("heroCtaSecondary")}</a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              {t("trustNoCreditCard")}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              {t("trustFreeClients")}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              {t("trustCancelAnytime")}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-card">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-muted-foreground">
                  trainhub.app/dashboard
                </span>
              </div>

              <div className="flex min-h-[340px] sm:min-h-[400px]">
                {/* Mini sidebar */}
                <div className="hidden sm:flex flex-col w-14 border-r border-border/50 bg-card/80 py-4 items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">TH</span>
                  </div>
                  <div className="h-px w-6 bg-border/50" />
                  {[
                    { icon: LayoutDashboard, active: true },
                    { icon: Users, active: false },
                    { icon: Dumbbell, active: false },
                    { icon: UtensilsCrossed, active: false },
                    { icon: CreditCard, active: false },
                    { icon: MessageSquare, active: false },
                  ].map(({ icon: Icon, active }, idx) => (
                    <div
                      key={idx}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground/50 hover:text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-background/50 via-background/30 to-primary/5 overflow-hidden">
                  {/* Welcome header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground/90 text-left">
                        {t("previewWelcome")} 👋
                      </h3>
                      <p className="text-xs text-muted-foreground/70 text-left">
                        {t("previewTodaySummary")}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">C</span>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      {
                        icon: Users,
                        value: "24",
                        label: t("previewActiveClients"),
                        trend: "+3",
                        color: "text-blue-400",
                        bg: "bg-blue-400/10",
                        borderColor: "border-blue-400/20",
                      },
                      {
                        icon: Dumbbell,
                        value: "156",
                        label: t("previewRoutinesCreated"),
                        trend: "+12",
                        color: "text-emerald-400",
                        bg: "bg-emerald-400/10",
                        borderColor: "border-emerald-400/20",
                      },
                      {
                        icon: UtensilsCrossed,
                        value: "18",
                        label: t("previewNutritionPlans"),
                        trend: "+5",
                        color: "text-orange-400",
                        bg: "bg-orange-400/10",
                        borderColor: "border-orange-400/20",
                      },
                      {
                        icon: CircleDollarSign,
                        value: "€2.4k",
                        label: t("previewRevenue"),
                        trend: "+18%",
                        color: "text-amber-400",
                        bg: "bg-amber-400/10",
                        borderColor: "border-amber-400/20",
                      },
                    ].map((stat) => {
                      const StatIcon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className={`rounded-lg border ${stat.borderColor} bg-card/60 p-3 transition-all`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`h-7 w-7 rounded-md ${stat.bg} flex items-center justify-center`}
                            >
                              <StatIcon className={`h-3.5 w-3.5 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                              {stat.trend}
                            </span>
                          </div>
                          <p className="text-lg sm:text-xl font-bold text-foreground/90 leading-none">
                            {stat.value}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1 truncate">
                            {stat.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom row: chart + activity */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {/* Mini chart */}
                    <div className="sm:col-span-3 rounded-lg border border-border/40 bg-card/60 p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-foreground/80">
                          {t("previewWeeklyProgress")}
                        </span>
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="flex items-end gap-1.5 h-16 sm:h-20">
                        {[40, 55, 35, 70, 50, 85, 65].map((h, idx) => (
                          <div key={idx} className="flex-1 flex flex-col justify-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.6 + idx * 0.08,
                                ease: "easeOut",
                              }}
                              className={`rounded-sm w-full ${
                                idx === 5
                                  ? "bg-primary"
                                  : "bg-primary/30"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                          <span key={d} className="text-[9px] text-muted-foreground/50 flex-1 text-center">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recent activity */}
                    <div className="sm:col-span-2 rounded-lg border border-border/40 bg-card/60 p-3">
                      <span className="text-xs font-medium text-foreground/80 block mb-3">
                        {t("previewRecentActivity")}
                      </span>
                      <div className="space-y-2.5">
                        {[
                          {
                            icon: Activity,
                            text: t("previewActivity1"),
                            time: "2m",
                            color: "text-emerald-400",
                            bg: "bg-emerald-400/10",
                          },
                          {
                            icon: CircleDollarSign,
                            text: t("previewActivity2"),
                            time: "15m",
                            color: "text-amber-400",
                            bg: "bg-amber-400/10",
                          },
                          {
                            icon: UtensilsCrossed,
                            text: t("previewActivity3"),
                            time: "1h",
                            color: "text-orange-400",
                            bg: "bg-orange-400/10",
                          },
                        ].map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div
                              key={item.text}
                              className="flex items-center gap-2"
                            >
                              <div
                                className={`h-6 w-6 rounded-full ${item.bg} flex items-center justify-center shrink-0`}
                              >
                                <ItemIcon className={`h-3 w-3 ${item.color}`} />
                              </div>
                              <span className="text-[10px] sm:text-xs text-foreground/70 truncate flex-1">
                                {item.text}
                              </span>
                              <span className="text-[9px] text-muted-foreground/50 shrink-0">
                                {item.time}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-3xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
