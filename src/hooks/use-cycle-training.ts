"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { cycleTrainingService } from "@/services/cycle-training.service";
import type { CyclePhase } from "@/services/menstrual.service";
import type { CycleTrainingConfigFormData, CyclePrivacyFormData } from "@/lib/validations/cycle-training";
import { toast } from "sonner";

// ── Trainer hooks ──

export function useCycleTrainingConfig(clientId: string) {
  return useQuery({
    queryKey: ["cycle-training-config", clientId],
    queryFn: () => cycleTrainingService.getConfig(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertCycleTrainingConfig(clientId: string) {
  const qc = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: (data: CycleTrainingConfigFormData) =>
      cycleTrainingService.upsertConfig(clientId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cycle-training-config", clientId] });
      toast.success(t("saved"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });
}

export function useCyclePerformanceLogs(clientId: string, options?: { phase?: CyclePhase }) {
  return useQuery({
    queryKey: ["cycle-performance-logs", clientId, options?.phase],
    queryFn: () => cycleTrainingService.getPerformanceLogs(clientId, { limit: 50, phase: options?.phase }),
    enabled: !!clientId,
    staleTime: 60 * 1000,
  });
}

export function useCyclePhaseStats(clientId: string) {
  return useQuery({
    queryKey: ["cycle-phase-stats", clientId],
    queryFn: () => cycleTrainingService.getPhaseStats(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClientCycleInfoFiltered(clientId: string) {
  return useQuery({
    queryKey: ["client-cycle-info-filtered", clientId],
    queryFn: () => cycleTrainingService.getClientCycleInfoFiltered(clientId),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000,
  });
}

// ── Client hooks ──

export function useTrainingSuggestion(cycleDay: number, phase: CyclePhase | null, symptoms: string[]) {
  return useQuery({
    queryKey: ["training-suggestion", cycleDay, phase, symptoms],
    queryFn: () => cycleTrainingService.getTrainingSuggestion(cycleDay, phase!, symptoms),
    enabled: !!phase && cycleDay > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogCyclePerformance() {
  const qc = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: cycleTrainingService.logPerformance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cycle-performance-logs"] });
      toast.success(t("saved"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });
}

export function useCyclePrivacySettings() {
  return useQuery({
    queryKey: ["cycle-privacy-settings"],
    queryFn: () => cycleTrainingService.getPrivacySettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateCyclePrivacy() {
  const qc = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: (data: CyclePrivacyFormData) =>
      cycleTrainingService.updatePrivacySettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cycle-privacy-settings"] });
      toast.success(t("saved"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });
}
