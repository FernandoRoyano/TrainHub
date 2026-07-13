"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import { STALE } from "@/lib/query-config";

export function useAnalytics(days: number = 90) {
  return useQuery({
    queryKey: ["analytics", days],
    queryFn: () => analyticsService.getAnalytics(days),
    staleTime: STALE.slow,
  });
}
