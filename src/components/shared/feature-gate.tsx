"use client";

import { useClientFeatures } from "@/contexts/client-features-context";
import { isFeatureEnabled } from "@/lib/feature-gate";
import type { FeatureKey } from "@/lib/validations/service-tier";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";

// El gating por tier solo se aplicaba a los botones de la barra de navegación:
// por URL directa, historial o notificaciones se llegaba igual a la página.
// Este wrapper aplica la restricción en la propia página.
export function FeatureGate({
  feature,
  children,
}: {
  feature: FeatureKey;
  children: React.ReactNode;
}) {
  const t = useTranslations("clientApp");
  const { features, isLoading } = useClientFeatures();

  // Mientras carga, features es null => isFeatureEnabled devuelve true y se
  // muestra el contenido (sin parpadeo de "bloqueado" para la mayoría).
  if (!isLoading && !isFeatureEnabled(features, feature)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">
          {t("featureNotIncluded")}
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
