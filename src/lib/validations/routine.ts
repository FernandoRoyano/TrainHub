import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export const GROUP_TYPES = ["solo", "superset", "triset", "circuit", "emom", "amrap"] as const;
export type GroupType = (typeof GROUP_TYPES)[number];

export const routineExerciseSchema = z.object({
  exercise_id: z.string().uuid(),
  order_index: z.number().int().min(0),
  sets: z.number().int().min(1).max(20),
  reps: z.string().min(1),
  rest_seconds: z.number().int().min(0).max(600),
  notes: z.string().optional().or(z.literal("")),
  superset_group: z.number().int().nullable().optional(),
});

export const exerciseGroupSchema = z.object({
  group_type: z.enum(GROUP_TYPES),
  order_index: z.number().int().min(0),
  rounds: z.number().int().min(1).max(100).nullable().optional(),
  time_limit_seconds: z.number().int().min(0).max(7200).nullable().optional(),
  rest_between_rounds: z.number().int().min(0).max(600).nullable().optional(),
  label: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  exercises: z.array(routineExerciseSchema),
});

export const routineDaySchema = z.object({
  day_number: z.number().int().min(1),
  name: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  groups: z.array(exerciseGroupSchema).optional(),
  exercises: z.array(routineExerciseSchema), // backward compat
});

export function createRoutineSchema(t: T) {
  return z.object({
    name: z.string().min(2, t("minChars", { min: 2 })),
    description: z.string().optional().or(z.literal("")),
    final_notes: z.string().optional().or(z.literal("")),
    duration_weeks: z.number().int().min(1).max(52),
    days_per_week: z.number().int().min(1).max(7),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    target_gender: z.enum(["male", "female", "unisex"]),
    is_template: z.boolean(),
    cover_image: z.string().optional().or(z.literal("")),
    days: z.array(routineDaySchema),
  });
}

export const assignRoutineSchema = z.object({
  client_id: z.string().uuid(),
  routine_id: z.string().uuid(),
  start_date: z.string().min(1),
  notes: z.string().optional().or(z.literal("")),
});

export type RoutineFormData = z.infer<ReturnType<typeof createRoutineSchema>>;
export type RoutineDayData = z.infer<typeof routineDaySchema>;
export type RoutineExerciseData = z.infer<typeof routineExerciseSchema>;
export type ExerciseGroupData = z.infer<typeof exerciseGroupSchema>;
export type AssignRoutineData = z.infer<typeof assignRoutineSchema>;
