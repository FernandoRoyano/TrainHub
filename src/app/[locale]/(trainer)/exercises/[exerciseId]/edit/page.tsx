"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useExercise } from "@/hooks/use-exercises";
import { ExerciseForm } from "@/components/exercises/exercise-form";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-error-state";

export default function EditExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const tc = useTranslations("common");
  const { data: exercise, isLoading, isError, refetch, isRefetching } = useExercise(exerciseId);

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

  if (!exercise) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <ExerciseForm mode="edit" exercise={exercise} />;
}
