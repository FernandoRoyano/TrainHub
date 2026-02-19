"use client";

import { useParams } from "next/navigation";
import { useRoutine } from "@/hooks/use-routines";
import { RoutineBuilder } from "@/components/routines/routine-builder";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditRoutinePage() {
  const { routineId } = useParams<{ routineId: string }>();
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
    return <p className="text-muted-foreground">Routine not found</p>;
  }

  return <RoutineBuilder mode="edit" routine={routine} />;
}
