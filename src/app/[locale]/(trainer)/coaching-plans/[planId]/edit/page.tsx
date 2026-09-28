"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCoachingPlan } from "@/hooks/use-coaching-plans";
import { CoachingPlanForm } from "@/components/coaching-plans/coaching-plan-form";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function EditCoachingPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const tc = useTranslations("common");
  const { data: plan, isLoading, isError, refetch, isRefetching } = useCoachingPlan(planId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <QueryErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;
  }

  if (!plan) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <CoachingPlanForm mode="edit" plan={plan} />;
}
