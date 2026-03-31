"use client";

import { createContext, useContext, useEffect } from "react";
import { useMyActiveServiceTier } from "@/hooks/use-client-app";
import { createClient } from "@/lib/supabase/client";
import type { ServiceTierFeatures } from "@/lib/validations/service-tier";
import type { ServiceTier } from "@/services/service-tiers.service";

interface ClientFeaturesValue {
  features: ServiceTierFeatures | null;
  tier: ServiceTier | null;
  isLoading: boolean;
}

const ClientFeaturesContext = createContext<ClientFeaturesValue>({
  features: null,
  tier: null,
  isLoading: true,
});

export function ClientFeaturesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useMyActiveServiceTier();

  // Ping: update clients.updated_at on each app load for "last seen" tracking
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (client) {
        await supabase
          .from("clients")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", client.id);
      }
    })();
  }, []);

  const value: ClientFeaturesValue = {
    features: data?.service_tier?.features ?? null,
    tier: data?.service_tier ?? null,
    isLoading,
  };

  return (
    <ClientFeaturesContext.Provider value={value}>
      {children}
    </ClientFeaturesContext.Provider>
  );
}

export function useClientFeatures() {
  return useContext(ClientFeaturesContext);
}
