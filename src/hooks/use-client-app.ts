"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { clientAppService } from "@/services/client-app.service";
import { toast } from "sonner";

export function useMyRoutine() {
  return useQuery({
    queryKey: ["my-routine"],
    queryFn: () => clientAppService.getMyActiveRoutine(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyClient() {
  return useQuery({
    queryKey: ["my-client"],
    queryFn: () => clientAppService.getMyClientRecord(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkoutLogs(clientRoutineId: string) {
  return useQuery({
    queryKey: ["workout-logs", clientRoutineId],
    queryFn: () => clientAppService.getWorkoutLogs(clientRoutineId),
    enabled: !!clientRoutineId,
    staleTime: 30 * 1000,
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
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      clientAppService.completeWorkout(id, notes),
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
  const t = useTranslations("clientApp");
  return useMutation({
    mutationFn: ({
      workoutLogId,
      routineExerciseId,
      data,
    }: {
      workoutLogId: string;
      routineExerciseId: string;
      data: { sets_completed: number; weight_used?: number; reps_completed?: string; feedback?: string };
    }) =>
      clientAppService.logExercise(workoutLogId, routineExerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercise-logs"] });
      toast.success(t("exerciseSaved"));
    },
  });
}

export function useMyMeasurements() {
  return useQuery({
    queryKey: ["my-measurements"],
    queryFn: () => clientAppService.getMyMeasurements(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddMyMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof clientAppService.addMyMeasurement>[0]) =>
      clientAppService.addMyMeasurement(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-measurements"] });
      toast.success("Medicion guardada");
    },
    onError: () => {
      toast.error("Error al guardar medicion");
    },
  });
}

export function useProgressData(clientRoutineId: string) {
  return useQuery({
    queryKey: ["progress-data", clientRoutineId],
    queryFn: () => clientAppService.getProgressData(clientRoutineId),
    enabled: !!clientRoutineId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyMealPlan() {
  return useQuery({
    queryKey: ["my-meal-plan"],
    queryFn: () => clientAppService.getMyActiveMealPlan(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyQuestionnaires() {
  return useQuery({
    queryKey: ["my-questionnaires"],
    queryFn: () => clientAppService.getMyQuestionnaires(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyQuestionnaireDetail(id: string) {
  return useQuery({
    queryKey: ["my-questionnaire-detail", id],
    queryFn: () => clientAppService.getMyQuestionnaireDetail(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useSubmitQuestionnaireResponses() {
  const queryClient = useQueryClient();
  const t = useTranslations("clientApp");
  return useMutation({
    mutationFn: ({
      clientQuestionnaireId,
      responses,
    }: {
      clientQuestionnaireId: string;
      responses: {
        question_id: string;
        answer_text?: string | null;
        answer_number?: number | null;
        answer_boolean?: boolean | null;
        answer_date?: string | null;
        answer_json?: Record<string, unknown> | null;
      }[];
    }) =>
      clientAppService.submitQuestionnaireResponses(
        clientQuestionnaireId,
        responses
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-questionnaires"] });
      queryClient.invalidateQueries({
        queryKey: ["my-questionnaire-detail"],
      });
      toast.success(t("questionnaireCompleted"));
    },
    onError: () => {
      toast.error(t("questionnaireSubmitError"));
    },
  });
}

export function useMyActiveCoachingPlan() {
  return useQuery({
    queryKey: ["my-coaching-plan"],
    queryFn: () => clientAppService.getMyActiveCoachingPlan(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyActiveServiceTier() {
  return useQuery({
    queryKey: ["my-service-tier"],
    queryFn: () => clientAppService.getMyActiveServiceTier(),
    staleTime: 5 * 60 * 1000,
  });
}
