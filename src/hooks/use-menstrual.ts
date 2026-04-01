"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { menstrualService } from "@/services/menstrual.service";
import type { FlowLevel, MoodLevel, CyclePhase } from "@/services/menstrual.service";
import { toast } from "sonner";

export function useMenstrualSettings() {
  return useQuery({
    queryKey: ["menstrual-settings"],
    queryFn: () => menstrualService.getMenstrualSettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateMenstrualSettings() {
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: menstrualService.updateMenstrualSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menstrual-settings"] });
      queryClient.invalidateQueries({ queryKey: ["cycle-info"] });
      toast.success(t("saved"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });
}

export function useLogMenstrualDay() {
  const queryClient = useQueryClient();
  const t = useTranslations("common");

  return useMutation({
    mutationFn: ({ date, data }: {
      date: string;
      data: {
        flow?: FlowLevel;
        symptoms?: string[];
        mood?: MoodLevel;
        energy_level?: number;
        notes?: string;
        cycle_day?: number;
        phase?: CyclePhase;
      };
    }) => menstrualService.logDay(date, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menstrual-month-logs"] });
      queryClient.invalidateQueries({ queryKey: ["menstrual-day-log"] });
      queryClient.invalidateQueries({ queryKey: ["cycle-info"] });
      toast.success(t("saved"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });
}

export function useMenstrualMonthLogs(year: number, month: number) {
  return useQuery({
    queryKey: ["menstrual-month-logs", year, month],
    queryFn: () => menstrualService.getMonthLogs(year, month),
    staleTime: 60 * 1000,
  });
}

export function useCycleInfo() {
  return useQuery({
    queryKey: ["cycle-info"],
    queryFn: () => menstrualService.getCycleInfo(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenstrualDayLog(date: string) {
  return useQuery({
    queryKey: ["menstrual-day-log", date],
    queryFn: () => menstrualService.getDayLog(date),
    enabled: !!date,
    staleTime: 30 * 1000,
  });
}
