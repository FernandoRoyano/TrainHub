"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { adminService, type AdminUserFilters } from "@/services/admin.service";
import { toast } from "sonner";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useAdminUsers(filters?: AdminUserFilters) {
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => adminService.getUsers(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminSubscriptions() {
  return useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: () => adminService.getSubscriptions(),
    staleTime: 30 * 1000,
  });
}

export function useStripeHealth() {
  return useQuery({
    queryKey: ["admin-stripe-health"],
    queryFn: () => adminService.getStripeHealth(),
    // Chequeo en vivo: no cachear mucho, y refetch manual con el botón.
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");
  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(t("userDeleted"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("userDeleteError"));
    },
  });
}

export function useSetClientLimit() {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");
  return useMutation({
    mutationFn: ({ userId, limit }: { userId: string; limit: number | null }) =>
      adminService.setClientLimit(userId, limit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(t("clientLimitUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("clientLimitError"));
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const t = useTranslations("admin");
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(t("roleUpdated"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("roleUpdateError"));
    },
  });
}
