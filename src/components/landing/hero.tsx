"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

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
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-muted-foreground">
                  trainhub.app/dashboard
                </span>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-card via-card to-primary/5 flex items-center justify-center p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
                  {[
                    { label: t("previewActiveClients"), value: "24" },
                    { label: t("previewRoutinesCreated"), value: "156" },
                    { label: t("previewMessages"), value: "8" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-background/50 border border-border/50 p-4 text-center"
                    >
                      <p className="text-2xl font-bold text-primary">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
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
