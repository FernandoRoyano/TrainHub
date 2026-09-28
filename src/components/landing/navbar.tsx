"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Dumbbell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("landing");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: t("navFeatures") },
    { href: "#pricing", label: t("navPricing") },
    { href: "#faq", label: t("navFaq") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex min-h-11 items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">
              Train<span className="text-primary">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">{t("startFree")}</Link>
            </Button>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("navCloseMenu") : t("navOpenMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="min-h-11 flex-1" asChild>
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button size="sm" className="min-h-11 flex-1" asChild>
                  <Link href="/register">{t("startFree")}</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
