export const APP_NAME = "TrainHub";

export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "core",
  "traps",
  "lats",
  "hip_flexors",
] as const;

export const EQUIPMENT = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "kettlebell",
  "band",
  "smith_machine",
  "ez_bar",
  "bench",
  "pull_up_bar",
  "trx",
] as const;

export const EXERCISE_CATEGORIES = [
  "strength",
  "cardio",
  "flexibility",
  "balance",
] as const;

export const BLOCK_TYPES = [
  "warmup",
  "cooldown",
  "circuit",
  "custom",
] as const;

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const CLIENT_STATUSES = [
  "active",
  "inactive",
  "paused",
  "pending",
] as const;

export const SUBSCRIPTION_TIERS = [
  "free",
  "pro",
  "elite",
] as const;

export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/join",
];
