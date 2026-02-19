"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  measurementsService,
  type MeasurementInput,
} from "@/services/measurements.service";
import { toast } from "sonner";

export function useMeasurements(clientId: string) {
  return useQuery({
    queryKey: ["measurements", clientId],
    queryFn: () => measurementsService.getMeasurements(clientId),
    enabled: !!clientId,
  });
}

export function useCreateMeasurement() {
  const queryClient = useQueryClient();
  const t = useTranslations("measurements");
  return useMutation({
    mutationFn: (data: MeasurementInput) =>
      measurementsService.createMeasurement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["measurements", variables.client_id],
      });
      toast.success(t("measurementSaved"));
    },
    onError: () => {
      toast.error(t("measurementSaveError"));
    },
  });
}

export function useUpdateMeasurement() {
  const queryClient = useQueryClient();
  const t = useTranslations("measurements");
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      clientId: string;
      data: Partial<MeasurementInput>;
    }) => measurementsService.updateMeasurement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["measurements", variables.clientId],
      });
      toast.success(t("measurementUpdated"));
    },
    onError: () => {
      toast.error(t("measurementUpdateError"));
    },
  });
}

export function useDeleteMeasurement() {
  const queryClient = useQueryClient();
  const t = useTranslations("measurements");
  return useMutation({
    mutationFn: ({ id }: { id: string; clientId: string }) =>
      measurementsService.deleteMeasurement(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["measurements", variables.clientId],
      });
      toast.success(t("measurementDeleted"));
    },
    onError: () => {
      toast.error(t("measurementDeleteError"));
    },
  });
}
