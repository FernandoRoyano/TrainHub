"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QueryErrorStateProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

// Estado en línea para cuando falla la carga de datos de una página. Sin él,
// un fallo de red caía en la rama "vacío" y la pantalla decía "no hay datos".
export function QueryErrorState({ onRetry, isRetrying = false }: QueryErrorStateProps) {
  const t = useTranslations("common");

  return (
    <div role="alert" className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold">{t("errorTitle")}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {t("errorDescription")}
      </p>
      <Button className="mt-4" onClick={onRetry} disabled={isRetrying}>
        <RefreshCw className={cn("mr-2 h-4 w-4", isRetrying && "animate-spin")} />
        {t("tryAgain")}
      </Button>
    </div>
  );
}
