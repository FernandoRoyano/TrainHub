"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClientWorkoutHistory } from "@/hooks/use-clients";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Dumbbell, Check, ChevronDown, ChevronUp } from "lucide-react";

interface WorkoutsTabProps {
  clientId: string;
}

export function WorkoutsTab({ clientId }: WorkoutsTabProps) {
  const t = useTranslations("workouts");
  const tc = useTranslations("clientApp");
  const { data: history, isLoading } = useClientWorkoutHistory(clientId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <EmptyState
        icon={Dumbbell}
        title={t("noWorkoutsYet")}
      />
    );
  }

  return (
    <div className="space-y-2">
      {history.map((workout) => {
        const isExpanded = expandedId === workout.id;
        const hasExercises = workout.exercise_logs.length > 0;

        return (
          <Card key={workout.id}>
            <CardContent className="p-3">
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : workout.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{workout.date}</span>
                  <Badge
                    variant={workout.completed ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {workout.completed ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        {tc("workoutCompleted")}
                      </>
                    ) : (
                      tc("workoutInProgress")
                    )}
                  </Badge>
                  {hasExercises && (
                    <span className="text-xs text-muted-foreground">
                      {workout.exercise_logs.length} {t("exercisesLogged")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {workout.notes && (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {workout.notes}
                    </span>
                  )}
                  {hasExercises &&
                    (isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ))}
                </div>
              </button>

              {isExpanded && hasExercises && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {workout.exercise_logs.map((el) => (
                    <div key={el.id} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {el.routine_exercise?.exercise?.name ?? "Exercise"}
                        </span>
                        <div className="flex items-center gap-3 text-muted-foreground text-xs">
                          <span>
                            {el.sets_completed} {t("setsLabel")}
                          </span>
                          {!el.set_logs?.length && el.reps_completed && (
                            <span>
                              {el.reps_completed} {t("repsLabel")}
                            </span>
                          )}
                          {!el.set_logs?.length && el.weight_used != null && (
                            <span>
                              {el.weight_used} {t("weightLabel")}
                            </span>
                          )}
                        </div>
                      </div>
                      {el.set_logs && el.set_logs.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {el.set_logs.map((s) => (
                            <div
                              key={s.set}
                              className="flex items-center gap-2 text-xs text-muted-foreground pl-1"
                            >
                              <span className="w-5 shrink-0 font-semibold text-foreground/70">
                                {s.set}.
                              </span>
                              <span className="tabular-nums">
                                {s.reps || "?"}
                                {s.weight != null ? ` × ${s.weight}kg` : ""}
                              </span>
                              {s.rir != null && (
                                <span className="tabular-nums">{tc("rirShort")} {s.rir}</span>
                              )}
                              {s.rest_seconds != null && (
                                <span className="tabular-nums">{s.rest_seconds}s</span>
                              )}
                              {s.note && <span className="italic truncate">“{s.note}”</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
