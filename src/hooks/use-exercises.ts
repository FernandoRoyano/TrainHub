"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  exercisesService,
  type ExerciseFilters,
} from "@/services/exercises.service";
import type { ExerciseFormData } from "@/lib/validations/exercise";
import { STALE } from "@/lib/query-config";
import { toast } from "sonner";

export function useExercises(filters?: ExerciseFilters) {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: () => exercisesService.getExercises(filters),
    // Catálogo casi estático; las mutaciones propias invalidan ["exercises"]
    staleTime: STALE.catalog,
    placeholderData: keepPreviousData,
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ["exercises", id],
    queryFn: () => exercisesService.getExerciseById(id),
    enabled: !!id,
    staleTime: STALE.catalog,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  const t = useTranslations("exercises");
  return useMutation({
    mutationFn: (data: ExerciseFormData) =>
      exercisesService.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success(t("exerciseCreated"));
    },
    onError: () => {
      toast.error(t("exerciseCreateError"));
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();
  const t = useTranslations("exercises");
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ExerciseFormData>;
    }) => exercisesService.updateExercise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success(t("exerciseUpdated"));
    },
    onError: () => {
      toast.error(t("exerciseUpdateError"));
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  const t = useTranslations("exercises");
  return useMutation({
    mutationFn: (id: string) => exercisesService.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success(t("exerciseDeleted"));
    },
    onError: () => {
      toast.error(t("exerciseDeleteError"));
    },
  });
}

export function useUploadMedia() {
  const t = useTranslations("exercises");
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: string }) =>
      exercisesService.uploadMedia(file, folder),
    onError: () => {
      toast.error(t("uploadError"));
    },
  });
}
