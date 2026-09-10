"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import {
  toDisplayWeight,
  toStoredWeightKg,
  formatWeight,
  type WeightUnit,
} from "@/lib/weight-units";

export function useWeightUnit() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const settings = (profile?.settings ?? {}) as Record<string, unknown>;
  const unit: WeightUnit = settings.weightUnit === "lb" ? "lb" : "kg";

  const setUnitMutation = useMutation({
    mutationFn: (newUnit: WeightUnit) =>
      authService.updateSettings({ ...settings, weightUnit: newUnit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
    },
  });

  return {
    unit,
    setUnit: setUnitMutation.mutate,
    isSavingUnit: setUnitMutation.isPending,
    toDisplay: (kg: number | null | undefined) => toDisplayWeight(kg, unit),
    toStoredKg: (value: number | string | null | undefined) =>
      toStoredWeightKg(value, unit),
    format: (kg: number | null | undefined) => formatWeight(kg, unit),
  };
}
