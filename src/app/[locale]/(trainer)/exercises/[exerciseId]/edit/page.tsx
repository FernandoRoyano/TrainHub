"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useExercise } from "@/hooks/use-exercises";
import { ExerciseForm } from "@/components/exercises/exercise-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const tc = useTranslations("common");
  const { data: exercise, isLoading } = useExercise(exerciseId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!exercise) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <ExerciseForm mode="edit" exercise={exercise} />;
}
