"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  routinesService,
  type RoutineFilters,
} from "@/services/routines.service";
import type { RoutineFormData, AssignRoutineData } from "@/lib/validations/routine";
import { toast } from "sonner";

export function useRoutines(filters?: RoutineFilters) {
  return useQuery({
    queryKey: ["routines", filters],
    queryFn: () => routinesService.getRoutines(filters),
    staleTime: 60 * 1000,
  });
}

export function useRoutine(id: string) {
  return useQuery({
    queryKey: ["routines", id],
    queryFn: () => routinesService.getRoutineById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();
  const t = useTranslations("routines");
  return useMutation({
    mutationFn: (data: RoutineFormData) =>
      routinesService.createRoutine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success(t("routineCreated"));
    },
    onError: () => {
      toast.error(t("routineCreateError"));
    },
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();
  const t = useTranslations("routines");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoutineFormData }) =>
      routinesService.updateRoutine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success(t("routineUpdated"));
    },
    onError: () => {
      toast.error(t("routineUpdateError"));
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();
  const t = useTranslations("routines");
  return useMutation({
    mutationFn: (id: string) => routinesService.deleteRoutine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success(t("routineDeleted"));
    },
    onError: () => {
      toast.error(t("routineDeleteError"));
    },
  });
}

export function useDuplicateRoutine() {
  const queryClient = useQueryClient();
  const t = useTranslations("routines");
  return useMutation({
    mutationFn: (id: string) =>
      routinesService.duplicateRoutine(id, t("copySuffix")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success(t("routineDuplicated"));
    },
    onError: () => {
      toast.error(t("routineDuplicateError"));
    },
  });
}

export function useUseTemplate() {
  const queryClient = useQueryClient();
  const t = useTranslations("templates");
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      routinesService.useTemplate(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success(t("templateUsed"));
    },
    onError: () => {
      toast.error(t("templateUseError"));
    },
  });
}

export function useAssignRoutine() {
  const queryClient = useQueryClient();
  const t = useTranslations("routines");
  return useMutation({
    mutationFn: (data: AssignRoutineData) =>
      routinesService.assignToClient(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["client-routines"] });
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success(t("routineAssigned"));

      fetch("/api/notifications/routine-assigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: variables.client_id,
          routineId: variables.routine_id,
          startDate: variables.start_date,
        }),
      }).catch(() => {});
    },
    onError: () => {
      toast.error(t("routineAssignError"));
    },
  });
}

export function useClientRoutines(clientId: string) {
  return useQuery({
    queryKey: ["client-routines", clientId],
    queryFn: () => routinesService.getClientRoutines(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}
