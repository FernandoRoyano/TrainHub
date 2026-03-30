"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  coachingPlansService,
  type CoachingPlanFilters,
} from "@/services/coaching-plans.service";
import type {
  CoachingPlanFormData,
  AssignCoachingPlanData,
} from "@/lib/validations/coaching-plan";
import { toast } from "sonner";

export function useCoachingPlans(filters?: CoachingPlanFilters) {
  return useQuery({
    queryKey: ["coaching-plans", filters],
    queryFn: () => coachingPlansService.getCoachingPlans(filters),
    staleTime: 60 * 1000,
  });
}

export function useCoachingPlan(id: string) {
  return useQuery({
    queryKey: ["coaching-plans", id],
    queryFn: () => coachingPlansService.getCoachingPlanById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateCoachingPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("coachingPlans");
  return useMutation({
    mutationFn: (data: CoachingPlanFormData) =>
      coachingPlansService.createCoachingPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-plans"] });
      toast.success(t("planCreated"));
    },
    onError: () => {
      toast.error(t("planCreateError"));
    },
  });
}

export function useUpdateCoachingPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("coachingPlans");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CoachingPlanFormData }) =>
      coachingPlansService.updateCoachingPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-plans"] });
      toast.success(t("planUpdated"));
    },
    onError: () => {
      toast.error(t("planUpdateError"));
    },
  });
}

export function useDeleteCoachingPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("coachingPlans");
  return useMutation({
    mutationFn: (id: string) => coachingPlansService.deleteCoachingPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-plans"] });
      toast.success(t("planDeleted"));
    },
    onError: () => {
      toast.error(t("planDeleteError"));
    },
  });
}

export function useDuplicateCoachingPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("coachingPlans");
  return useMutation({
    mutationFn: (id: string) =>
      coachingPlansService.duplicateCoachingPlan(id, t("copySuffix")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-plans"] });
      toast.success(t("planDuplicated"));
    },
    onError: () => {
      toast.error(t("planDuplicateError"));
    },
  });
}

export function useAssignCoachingPlan() {
  const queryClient = useQueryClient();
  const t = useTranslations("coachingPlans");
  return useMutation({
    mutationFn: async (data: AssignCoachingPlanData) => {
      const res = await fetch("/api/coaching-plans/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Assignment failed");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coaching-plans"] });
      queryClient.invalidateQueries({
        queryKey: ["client-coaching-plan", variables.client_id],
      });
      queryClient.invalidateQueries({ queryKey: ["client-routines"] });
      queryClient.invalidateQueries({ queryKey: ["client-meal-plans"] });
      queryClient.invalidateQueries({ queryKey: ["client-service-tier"] });
      toast.success(t("planAssigned"));
    },
    onError: () => {
      toast.error(t("planAssignError"));
    },
  });
}

export function useClientCoachingPlan(clientId: string) {
  return useQuery({
    queryKey: ["client-coaching-plan", clientId],
    queryFn: () => coachingPlansService.getClientCoachingPlan(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}

export function useClientCoachingPlanHistory(clientId: string) {
  return useQuery({
    queryKey: ["client-coaching-plan-history", clientId],
    queryFn: () => coachingPlansService.getClientCoachingPlanHistory(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}
