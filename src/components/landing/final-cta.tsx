"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell } from "lucide-react";

export function FinalCTA() {
  const t = useTranslations("landing");

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-14 text-center overflow-hidden reveal-on-scroll">
          {/* Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none float-y" />

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center pulse-glow">
                <Dumbbell className="h-7 w-7 text-primary" />
              </div>
            </div>

            <h2 className="text-fluid-4xl font-bold mb-4 leading-tight">
              {t("ctaTitle")}
              <br />
              <span className="bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                {t("ctaTitleHighlight")}
              </span>
            </h2>
            <p className="text-muted-foreground text-fluid-base max-w-lg mx-auto mb-8">
              {t("ctaSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="px-8" asChild>
                <Link href="/register">
                  {t("ctaPrimary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#pricing">{t("ctaSecondary")}</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              {t("ctaTrust")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
