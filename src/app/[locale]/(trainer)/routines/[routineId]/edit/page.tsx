"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRoutine } from "@/hooks/use-routines";
import { RoutineBuilder } from "@/components/routines/routine-builder";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditRoutinePage() {
  const { routineId } = useParams<{ routineId: string }>();
  const tc = useTranslations("common");
  const { data: routine, isLoading } = useRoutine(routineId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!routine) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <RoutineBuilder mode="edit" routine={routine} />;
}
