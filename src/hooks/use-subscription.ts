"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { TIER_LIMITS } from "@/lib/stripe/plans";

export interface SubscriptionData {
  tier: "free" | "pro" | "elite";
  status: string;
  clientLimit: number;
  canAddClient: boolean;
  activeClientCount: number;
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription-gate"],
    queryFn: async (): Promise<SubscriptionData> => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { tier: "free", status: "active", clientLimit: 3, canAddClient: true, activeClientCount: 0 };
      }

      // Fetch subscription, role and client count in parallel
      const [subResult, roleResult, clientResult] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("tier, status")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("clients")
          .select("id", { count: "exact", head: true })
          .eq("trainer_id", user.id),
      ]);

      // Admins de la plataforma: sin límites, independientemente de la
      // suscripción (mismo bypass que el trigger 00046 en BD)
      const isAdmin = roleResult.data?.role === "admin";

      const rawTier = (subResult.data?.tier as "free" | "pro" | "elite") || "free";
      const status = subResult.data?.status || "active";
      // Mismo criterio que el trigger de BD (00035): el tier de pago solo cuenta
      // con suscripción active/trialing; past_due, canceled, etc. limitan como free.
      const tier = isAdmin
        ? "elite"
        : status === "active" || status === "trialing"
          ? rawTier
          : "free";
      const activeClientCount = clientResult.count ?? 0;
      const clientLimit = TIER_LIMITS[tier];
      const canAddClient = activeClientCount < clientLimit;

      return {
        tier,
        status,
        clientLimit,
        canAddClient,
        activeClientCount,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
