import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { STALE, STALE_DASHBOARD, BADGE_POLL_INTERVAL } from "@/lib/query-config";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
    staleTime: STALE_DASHBOARD,
  });
}

export function useSidebarBadges() {
  return useQuery({
    queryKey: ["sidebar-badges"],
    queryFn: () => dashboardService.getSidebarBadges(),
    staleTime: STALE.fast,
    refetchInterval: BADGE_POLL_INTERVAL,
    refetchIntervalInBackground: false,
  });
}
