import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export function createExerciseSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    name_es: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    instructions: z.string().optional().or(z.literal("")),
    video_url: z.string().optional().or(z.literal("")),
    thumbnail_url: z.string().optional().or(z.literal("")),
    muscle_groups: z.array(z.string()),
    equipment: z.array(z.string()),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    category: z.enum(["strength", "cardio", "flexibility", "balance"]),
    primary_muscles: z.array(z.string()).optional(),
    secondary_muscles: z.array(z.string()).optional(),
    exercise_type: z.string().optional().or(z.literal("")),
    mechanics: z.string().optional().or(z.literal("")),
    force: z.string().optional().or(z.literal("")),
  });
}

export type ExerciseFormData = z.infer<ReturnType<typeof createExerciseSchema>>;
