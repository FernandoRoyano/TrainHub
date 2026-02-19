"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell } from "lucide-react";

export function FinalCTA() {
  const t = useTranslations("landing");

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-14 text-center overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                <Dumbbell className="h-7 w-7 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("ctaTitle")}
              <br />
              <span className="text-primary">{t("ctaTitleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
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
        </motion.div>
      </div>
    </section>
  );
}
