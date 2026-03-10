"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface SubscriptionData {
  tier: "free" | "pro" | "elite";
  status: string;
  clientLimit: number;
  canAddClient: boolean;
  activeClientCount: number;
}

const TIER_LIMITS = {
  free: 3,
  pro: 25,
  elite: Infinity,
} as const;

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription-gate"],
    queryFn: async (): Promise<SubscriptionData> => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { tier: "free", status: "active", clientLimit: 3, canAddClient: true, activeClientCount: 0 };
      }

      // Fetch subscription and client count in parallel
      const [subResult, clientResult] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("tier, status")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("clients")
          .select("id", { count: "exact", head: true })
          .eq("trainer_id", user.id),
      ]);

      const tier = (subResult.data?.tier as "free" | "pro" | "elite") || "free";
      const activeClientCount = clientResult.count ?? 0;
      const clientLimit = TIER_LIMITS[tier];
      const canAddClient = activeClientCount < clientLimit;

      return {
        tier,
        status: subResult.data?.status || "active",
        clientLimit,
        canAddClient,
        activeClientCount,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
