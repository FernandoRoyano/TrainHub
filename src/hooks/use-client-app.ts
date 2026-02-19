"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { clientAppService } from "@/services/client-app.service";
import { toast } from "sonner";

export function useMyRoutine() {
  return useQuery({
    queryKey: ["my-routine"],
    queryFn: () => clientAppService.getMyActiveRoutine(),
  });
}

export function useMyClient() {
  return useQuery({
    queryKey: ["my-client"],
    queryFn: () => clientAppService.getMyClientRecord(),
  });
}

export function useWorkoutLogs(clientRoutineId: string) {
  return useQuery({
    queryKey: ["workout-logs", clientRoutineId],
    queryFn: () => clientAppService.getWorkoutLogs(clientRoutineId),
    enabled: !!clientRoutineId,
  });
}

export function useStartWorkout() {
  const queryClient = useQueryClient();
  const t = useTranslations("clientApp");
  return useMutation({
    mutationFn: ({
      clientId,
      clientRoutineId,
      routineDayId,
    }: {
      clientId: string;
      clientRoutineId: string;
      routineDayId: string;
    }) =>
      clientAppService.startWorkout(clientId, clientRoutineId, routineDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-logs"] });
    },
    onError: () => {
      toast.error(t("startWorkoutError"));
    },
  });
}

export function useCompleteWorkout() {
  const queryClient = useQueryClient();
  const t = useTranslations("clientApp");
  return useMutation({
    mutationFn: (workoutLogId: string) =>
      clientAppService.completeWorkout(workoutLogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-logs"] });
      toast.success(t("workoutCompletedToast"));
    },
    onError: () => {
      toast.error(t("workoutCompleteError"));
    },
  });
}

export function useLogExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workoutLogId,
      routineExerciseId,
      data,
    }: {
      workoutLogId: string;
      routineExerciseId: string;
      data: { sets_completed: number; weight_used?: number; reps_completed?: string };
    }) =>
      clientAppService.logExercise(workoutLogId, routineExerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercise-logs"] });
    },
  });
}

export function useMyMeasurements() {
  return useQuery({
    queryKey: ["my-measurements"],
    queryFn: () => clientAppService.getMyMeasurements(),
  });
}

export function useProgressData(clientRoutineId: string) {
  return useQuery({
    queryKey: ["progress-data", clientRoutineId],
    queryFn: () => clientAppService.getProgressData(clientRoutineId),
    enabled: !!clientRoutineId,
  });
}
