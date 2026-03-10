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
