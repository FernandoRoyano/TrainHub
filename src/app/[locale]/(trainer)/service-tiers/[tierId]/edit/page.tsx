"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useServiceTier } from "@/hooks/use-service-tiers";
import { ServiceTierForm } from "@/components/service-tiers/service-tier-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditServiceTierPage() {
  const { tierId } = useParams<{ tierId: string }>();
  const tc = useTranslations("common");
  const { data: tier, isLoading } = useServiceTier(tierId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!tier) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <ServiceTierForm mode="edit" tier={tier} />;
}
