import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export function createCoachingPlanSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    description: z.string().optional().or(z.literal("")),
    cover_image: z.string().optional().or(z.literal("")),
    duration_weeks: z.number().int().min(1).max(52),
    service_tier_id: z.string().uuid().optional().or(z.literal("")),
    routine_template_id: z.string().uuid().optional().or(z.literal("")),
    meal_plan_template_id: z.string().uuid().optional().or(z.literal("")),
    questionnaire_template_ids: z.array(z.string().uuid()).optional(),
    price: z.number().min(0).optional(),
    currency: z.string().optional().or(z.literal("")),
    tags: z.array(z.string()).optional(),
    is_active: z.boolean(),
    is_published: z.boolean(),
  });
}

export const assignCoachingPlanSchema = z.object({
  client_id: z.string().uuid(),
  coaching_plan_id: z.string().uuid(),
  start_date: z.string().min(1),
  notes: z.string().optional().or(z.literal("")),
});

export type CoachingPlanFormData = z.infer<ReturnType<typeof createCoachingPlanSchema>>;
export type AssignCoachingPlanData = z.infer<typeof assignCoachingPlanSchema>;
