import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useSidebarBadges() {
  return useQuery({
    queryKey: ["sidebar-badges"],
    queryFn: () => dashboardService.getSidebarBadges(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
