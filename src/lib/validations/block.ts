import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const blockExerciseSchema = z.object({
  exercise_id: z.string().uuid(),
  order_index: z.number().int().min(0),
  sets: z.number().int().min(1).max(20),
  reps: z.string().min(1),
  rest_seconds: z.number().int().min(0).max(600),
  notes: z.string().optional().or(z.literal("")),
  superset_group: z.number().int().nullable().optional(),
});

export function createBlockSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    description: z.string().optional().or(z.literal("")),
    block_type: z.enum(["warmup", "cooldown", "circuit", "custom"]),
    color: z.string().optional().or(z.literal("")),
    exercises: z.array(blockExerciseSchema),
  });
}

export type BlockFormData = z.infer<ReturnType<typeof createBlockSchema>>;
export type BlockExerciseData = z.infer<typeof blockExerciseSchema>;
