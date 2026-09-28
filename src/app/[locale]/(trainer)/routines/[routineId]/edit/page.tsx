"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRoutine } from "@/hooks/use-routines";
import { RoutineBuilder } from "@/components/routines/routine-builder";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function EditRoutinePage() {
  const { routineId } = useParams<{ routineId: string }>();
  const tc = useTranslations("common");
  const { data: routine, isLoading, isError, refetch, isRefetching } = useRoutine(routineId);

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

  if (!routine) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <RoutineBuilder mode="edit" routine={routine} />;
}
