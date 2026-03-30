"use client";

import { useTranslations } from "next-intl";
import { useClientServiceTier } from "@/hooks/use-service-tiers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";

interface PaymentsTabProps {
  clientId: string;
}

export function PaymentsTab({ clientId }: PaymentsTabProps) {
  const t = useTranslations("paymentsTab");
  const { data: clientTier, isLoading } = useClientServiceTier(clientId);

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="space-y-4">
      {/* Service Tier */}
      {clientTier?.service_tier && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-sm px-3 py-1"
                style={{
                  borderColor: clientTier.service_tier.color ?? undefined,
                  color: clientTier.service_tier.color ?? undefined,
                }}
              >
                {clientTier.service_tier.name}
              </Badge>
              {clientTier.service_tier.price != null && (
                <span className="text-sm text-muted-foreground">
                  {clientTier.service_tier.price} {clientTier.service_tier.currency ?? "EUR"}
                  {clientTier.service_tier.billing_interval && (
                    <span>/{clientTier.service_tier.billing_interval}</span>
                  )}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placeholder */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">{t("comingSoon")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
