"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem("pwa-dismissed")) {
      setDismissed(true);
      return;
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // iOS detection (no beforeinstallprompt support)
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    if (isIOSDevice && isSafari) {
      setIsIOS(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "1");
  };

  if (dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{t("installTitle")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isIOS ? t("iosInstructions") : t("installDescription")}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {!isIOS && (
          <Button onClick={handleInstall} size="sm" className="w-full mt-3">
            <Download className="h-4 w-4 mr-2" />
            {t("installButton")}
          </Button>
        )}
      </div>
    </div>
  );
}
