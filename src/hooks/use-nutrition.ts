"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  nutritionService,
  type NutritionFilters,
} from "@/services/nutrition.service";
import type { MealPlanFormData, AssignMealPlanData } from "@/lib/validations/nutrition";
import { toast } from "sonner";

export function useMealPlans(filters?: NutritionFilters) {
  return useQuery({
    queryKey: ["meal-plans", filters],
    queryFn: () => nutritionService.getMealPlans(filters),
    staleTime: 60 * 1000,
  });
}

export function useMealPlan(id: string) {
  return useQuery({
    queryKey: ["meal-plans", id],
    queryFn: () => nutritionService.getMealPlanById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("nutrition");
  return useMutation({
    mutationFn: (data: MealPlanFormData) =>
      nutritionService.createMealPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      toast.success(t("mealPlanCreated"));
    },
    onError: () => {
      toast.error(t("mealPlanCreateError"));
    },
  });
}

export function useUpdateMealPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("nutrition");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MealPlanFormData }) =>
      nutritionService.updateMealPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      toast.success(t("mealPlanUpdated"));
    },
    onError: () => {
      toast.error(t("mealPlanUpdateError"));
    },
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("nutrition");
  return useMutation({
    mutationFn: (id: string) => nutritionService.deleteMealPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      toast.success(t("mealPlanDeleted"));
    },
    onError: () => {
      toast.error(t("mealPlanDeleteError"));
    },
  });
}

export function useDuplicateMealPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("nutrition");
  return useMutation({
    mutationFn: (id: string) =>
      nutritionService.duplicateMealPlan(id, t("copySuffix")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      toast.success(t("mealPlanDuplicated"));
    },
    onError: () => {
      toast.error(t("mealPlanDuplicateError"));
    },
  });
}

export function useAssignMealPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("nutrition");
  return useMutation({
    mutationFn: (data: AssignMealPlanData) =>
      nutritionService.assignToClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-meal-plans"] });
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      toast.success(t("mealPlanAssigned"));
    },
    onError: () => {
      toast.error(t("mealPlanAssignError"));
    },
  });
}

export function useClientMealPlans(clientId: string) {
  return useQuery({
    queryKey: ["client-meal-plans", clientId],
    queryFn: () => nutritionService.getClientMealPlans(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}
