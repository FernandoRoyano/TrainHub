"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";

export function useAnalytics(days: number = 90) {
  return useQuery({
    queryKey: ["analytics", days],
    queryFn: () => analyticsService.getAnalytics(days),
    staleTime: 2 * 60 * 1000,
  });
}
