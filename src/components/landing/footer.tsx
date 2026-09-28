"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Dumbbell } from "lucide-react";
import { EcosystemSignature } from "@/components/shared/ecosystem-signature";

interface FooterLinkConfig {
  titleKey: string;
  links: { labelKey: string; href: string; localized?: boolean }[];
}

const footerLinkConfigs: FooterLinkConfig[] = [
  {
    titleKey: "footerProduct",
    links: [
      { labelKey: "footerFeatures", href: "#features" },
      { labelKey: "footerPricing", href: "#pricing" },
      { labelKey: "footerFaq", href: "#faq" },
    ],
  },
  {
    titleKey: "footerCompany",
    links: [
      { labelKey: "footerAbout", href: "#" },
      { labelKey: "footerBlog", href: "#" },
      { labelKey: "footerContact", href: "#" },
    ],
  },
  {
    titleKey: "footerLegal",
    links: [
      { labelKey: "footerPrivacy", href: "/privacy", localized: true },
      { labelKey: "footerTerms", href: "/terms", localized: true },
      { labelKey: "footerLegalNotice", href: "/legal", localized: true },
    ],
  },
];

export function Footer() {
  const t = useTranslations("landing");
  const locale = useLocale();

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex min-h-11 items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold tracking-tight">
                Train<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>

          {/* Link columns */}
          {footerLinkConfigs.map((section) => (
            <div key={section.titleKey}>
              <h4 className="text-sm font-semibold mb-4">
                {t(section.titleKey)}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.localized ? `/${locale}${link.href}` : link.href}
                      className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t("footerCopyright", { year: new Date().getFullYear() })}
          </p>
          <EcosystemSignature locale={locale === "en" ? "en" : "es"} compact />
          <div className="flex flex-wrap items-center justify-center gap-x-4">
            <Link
              href="#"
              className="flex min-h-11 min-w-11 items-center justify-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="flex min-h-11 min-w-11 items-center justify-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="flex min-h-11 min-w-11 items-center justify-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
