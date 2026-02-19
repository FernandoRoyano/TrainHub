"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Dumbbell } from "lucide-react";

interface FooterLinkConfig {
  titleKey: string;
  links: { labelKey: string; href: string }[];
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
      { labelKey: "footerPrivacy", href: "#" },
      { labelKey: "footerTerms", href: "#" },
      { labelKey: "footerCookies", href: "#" },
    ],
  },
];

export function Footer() {
  const t = useTranslations("landing");

  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold tracking-tight">
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
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
