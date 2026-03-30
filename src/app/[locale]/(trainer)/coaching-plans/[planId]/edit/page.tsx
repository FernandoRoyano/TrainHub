"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCoachingPlan } from "@/hooks/use-coaching-plans";
import { CoachingPlanForm } from "@/components/coaching-plans/coaching-plan-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCoachingPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const tc = useTranslations("common");
  const { data: plan, isLoading } = useCoachingPlan(planId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!plan) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <CoachingPlanForm mode="edit" plan={plan} />;
}
