"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import { STALE, BADGE_POLL_INTERVAL } from "@/lib/query-config";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.getNotifications(),
    staleTime: STALE.fast,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => notificationsService.getUnreadCount(),
    staleTime: STALE.fast,
    refetchInterval: BADGE_POLL_INTERVAL,
    refetchIntervalInBackground: false,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}
