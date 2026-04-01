import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const clientProfileDataSchema = z.object({
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  birth_date: z.string().optional(),
  goals: z.string().optional(),
  injuries: z.string().optional(),
  medical_notes: z.string().optional(),
});

export function createClientSchema(t: T) {
  return z.object({
    full_name: z.string().min(2, t("minChars", { min: 2 })),
    email: z.string().min(1, t("required")).email(t("invalidEmail")),
    phone: z.string().optional().or(z.literal("")),
    status: z.enum(["active", "inactive", "paused", "pending"]),
    gender: z.enum(["male", "female", "other"]).optional(),
    tags: z.array(z.string()),
    notes: z.string().optional().or(z.literal("")),
    profile_data: clientProfileDataSchema.optional(),
  });
}

export type ClientFormData = z.infer<ReturnType<typeof createClientSchema>>;
export type ClientProfileData = z.infer<typeof clientProfileDataSchema>;
