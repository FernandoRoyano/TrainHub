"use client";

import { useQuery } from "@tanstack/react-query";
import { actionCenterService } from "@/services/action-center.service";
import { STALE } from "@/lib/query-config";

export function useActionItems() {
  return useQuery({
    queryKey: ["action-center"],
    queryFn: () => actionCenterService.getActionItems(),
    staleTime: STALE.standard,
  });
}
