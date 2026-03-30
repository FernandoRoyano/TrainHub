"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { serviceTiersService } from "@/services/service-tiers.service";
import type {
  ServiceTierFormData,
  AssignServiceTierData,
} from "@/lib/validations/service-tier";
import { toast } from "sonner";

export function useServiceTiers() {
  return useQuery({
    queryKey: ["service-tiers"],
    queryFn: () => serviceTiersService.getServiceTiers(),
    staleTime: 60 * 1000,
  });
}

export function useServiceTier(id: string) {
  return useQuery({
    queryKey: ["service-tiers", id],
    queryFn: () => serviceTiersService.getServiceTierById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateServiceTier() {
  const queryClient = useQueryClient();
  const t = useTranslations("serviceTiers");
  return useMutation({
    mutationFn: (data: ServiceTierFormData) =>
      serviceTiersService.createServiceTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-tiers"] });
      toast.success(t("tierCreated"));
    },
    onError: () => {
      toast.error(t("tierCreateError"));
    },
  });
}

export function useUpdateServiceTier() {
  const queryClient = useQueryClient();
  const t = useTranslations("serviceTiers");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceTierFormData }) =>
      serviceTiersService.updateServiceTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-tiers"] });
      toast.success(t("tierUpdated"));
    },
    onError: () => {
      toast.error(t("tierUpdateError"));
    },
  });
}

export function useDeleteServiceTier() {
  const queryClient = useQueryClient();
  const t = useTranslations("serviceTiers");
  return useMutation({
    mutationFn: (id: string) => serviceTiersService.deleteServiceTier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-tiers"] });
      toast.success(t("tierDeleted"));
    },
    onError: () => {
      toast.error(t("tierDeleteError"));
    },
  });
}

export function useAssignServiceTier() {
  const queryClient = useQueryClient();
  const t = useTranslations("serviceTiers");
  return useMutation({
    mutationFn: (data: AssignServiceTierData) =>
      serviceTiersService.assignTierToClient(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-tiers"] });
      queryClient.invalidateQueries({
        queryKey: ["client-service-tier", variables.client_id],
      });
      toast.success(t("tierAssigned"));
    },
    onError: () => {
      toast.error(t("tierAssignError"));
    },
  });
}

export function useClientServiceTier(clientId: string) {
  return useQuery({
    queryKey: ["client-service-tier", clientId],
    queryFn: () => serviceTiersService.getClientServiceTier(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}
