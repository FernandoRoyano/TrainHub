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

export const EXERCISE_TYPES = [
  "compound",
  "isolation",
  "cardio",
  "stretching",
  "plyometric",
] as const;

export const MECHANICS = ["compound", "isolation"] as const;

export const FORCE_TYPES = ["push", "pull", "static"] as const;

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
  "/auth/callback",
];

export const MEAL_TYPES = [
  "breakfast",
  "morning_snack",
  "lunch",
  "afternoon_snack",
  "dinner",
  "evening_snack",
  "pre_workout",
  "post_workout",
  "other",
] as const;

export const FOOD_UNITS = [
  "g",
  "ml",
  "oz",
  "cup",
  "tbsp",
  "tsp",
  "unit",
  "slice",
  "scoop",
] as const;

export const NUTRITION_GOALS = [
  "loss",
  "maintenance",
  "gain",
  "performance",
  "health",
] as const;

export const FOOD_CATEGORIES = [
  "protein",
  "dairy",
  "grain",
  "vegetable",
  "fruit",
  "legume",
  "nut_seed",
  "oil_fat",
  "beverage",
  "supplement",
  "snack",
  "condiment",
  "other",
] as const;
