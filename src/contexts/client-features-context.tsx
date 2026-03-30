"use client";

import { createContext, useContext } from "react";
import { useMyActiveServiceTier } from "@/hooks/use-client-app";
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
