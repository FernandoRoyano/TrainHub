"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { paymentsService } from "@/services/payments.service";
import type { PaymentFormData } from "@/lib/validations/payment";
import { toast } from "sonner";

export function useClientPayments(clientId: string) {
  return useQuery({
    queryKey: ["client-payments", clientId],
    queryFn: () => paymentsService.getClientPayments(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}

export function usePaymentsSummary(clientId: string) {
  return useQuery({
    queryKey: ["payments-summary", clientId],
    queryFn: () => paymentsService.getPaymentsSummary(clientId),
    enabled: !!clientId,
    staleTime: 30 * 1000,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const t = useTranslations("payments");
  return useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: PaymentFormData;
    }) => paymentsService.createPayment(clientId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["client-payments", variables.clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payments-summary", variables.clientId],
      });
      toast.success(t("paymentCreated"));
    },
    onError: () => {
      toast.error(t("paymentCreateError"));
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  const t = useTranslations("payments");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaymentFormData }) =>
      paymentsService.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments-summary"] });
      toast.success(t("paymentUpdated"));
    },
    onError: () => {
      toast.error(t("paymentUpdateError"));
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  const t = useTranslations("payments");
  return useMutation({
    mutationFn: (id: string) => paymentsService.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments-summary"] });
      toast.success(t("paymentDeleted"));
    },
    onError: () => {
      toast.error(t("paymentDeleteError"));
    },
  });
}

export function useUpcomingPayments() {
  return useQuery({
    queryKey: ["upcoming-payments"],
    queryFn: () => paymentsService.getUpcomingPayments(),
    staleTime: 60 * 1000,
  });
}
