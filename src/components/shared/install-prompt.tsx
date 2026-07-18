"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";

// Evento no estándar de Chromium para instalar PWAs.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "trainhub_install_dismissed";

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// Banner discreto que ofrece instalar la app. En Android/desktop usa el
// prompt nativo (beforeinstallprompt); en iOS Safari muestra instrucciones
// manuales porque no expone ese evento.
export function InstallPrompt() {
  const t = useTranslations("install");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    setDismissed(false);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS no dispara beforeinstallprompt: enséñale las instrucciones.
    if (isIos()) setShowIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  if (dismissed || (!deferred && !showIosHint)) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm">
      <Download className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{t("title")}</p>
        {deferred ? (
          <Button size="sm" className="mt-2 h-8" onClick={install}>
            {t("installButton")}
          </Button>
        ) : (
          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {t("iosStep1")}
            <Share className="h-3.5 w-3.5" />
            {t("iosStep2")}
          </p>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label={t("dismiss")}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
