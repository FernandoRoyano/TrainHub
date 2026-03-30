import type { ServiceTierFeatures, FeatureKey } from "@/lib/validations/service-tier";

/**
 * Check whether a specific feature is enabled for a service tier.
 * If no tier / features object is provided, all features are enabled
 * (backward compatibility for clients without an assigned tier).
 */
export function isFeatureEnabled(
  features: ServiceTierFeatures | null | undefined,
  key: FeatureKey,
): boolean {
  if (!features) return true;
  return features[key] ?? false;
}
