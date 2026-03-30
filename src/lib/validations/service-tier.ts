import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const FEATURE_KEYS = [
  "training",
  "nutrition",
  "messaging",
  "progress_tracking",
  "measurements",
  "checkins",
  "questionnaires",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export interface ServiceTierFeatures {
  training: boolean;
  nutrition: boolean;
  messaging: boolean;
  progress_tracking: boolean;
  measurements: boolean;
  checkins: boolean;
  questionnaires: boolean;
}

export const BILLING_INTERVALS = [
  "monthly",
  "quarterly",
  "yearly",
  "one_time",
] as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export function createServiceTierSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    description: z.string().optional().or(z.literal("")),
    color: z.string().optional().or(z.literal("")),
    price: z.number().min(0).optional(),
    currency: z.string().optional().or(z.literal("")),
    billing_interval: z.enum(BILLING_INTERVALS).optional(),
    features: z.object({
      training: z.boolean(),
      nutrition: z.boolean(),
      messaging: z.boolean(),
      progress_tracking: z.boolean(),
      measurements: z.boolean(),
      checkins: z.boolean(),
      questionnaires: z.boolean(),
    }),
    max_revisions_per_month: z.number().int().min(0).optional(),
    is_active: z.boolean(),
  });
}

export const assignServiceTierSchema = z.object({
  client_id: z.string().uuid(),
  service_tier_id: z.string().uuid(),
  start_date: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type ServiceTierFormData = z.infer<
  ReturnType<typeof createServiceTierSchema>
>;
export type AssignServiceTierData = z.infer<typeof assignServiceTierSchema>;
