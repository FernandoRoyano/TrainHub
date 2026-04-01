"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { fastingService } from "@/services/fasting.service";
import { toast } from "sonner";

export function useFastingSettings() {
  return useQuery({
    queryKey: ["fasting-settings"],
    queryFn: () => fastingService.getFastingSettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateFastingSettings() {
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: fastingService.updateFastingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fasting-settings"] });
      toast.success(t("saved"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });
}

export function useStartFast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ protocol, targetHours }: { protocol: string; targetHours: number }) =>
      fastingService.startFast(protocol, targetHours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-fast"] });
      queryClient.invalidateQueries({ queryKey: ["fasting-history"] });
      queryClient.invalidateQueries({ queryKey: ["fasting-stats"] });
    },
  });
}

export function useEndFast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => fastingService.endFast(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-fast"] });
      queryClient.invalidateQueries({ queryKey: ["fasting-history"] });
      queryClient.invalidateQueries({ queryKey: ["fasting-stats"] });
    },
  });
}

export function useActiveFast() {
  return useQuery({
    queryKey: ["active-fast"],
    queryFn: () => fastingService.getActiveFast(),
    refetchInterval: 10 * 1000,
  });
}

export function useFastingHistory() {
  return useQuery({
    queryKey: ["fasting-history"],
    queryFn: () => fastingService.getFastingHistory(),
    staleTime: 30 * 1000,
  });
}

export function useFastingStats() {
  return useQuery({
    queryKey: ["fasting-stats"],
    queryFn: () => fastingService.getFastingStats(),
    staleTime: 60 * 1000,
  });
}
