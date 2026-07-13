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

export const BODY_REGIONS = ["upper_body", "lower_body", "core"] as const;

export const MOVEMENT_PATTERNS = [
  "push",
  "pull",
  "hip_dominant",
  "knee_dominant",
  "core",
] as const;

/** Muscles that belong to each body region */
export const BODY_REGION_MUSCLES: Record<string, readonly string[]> = {
  upper_body: ["chest", "back", "shoulders", "biceps", "triceps", "forearms", "traps", "lats"],
  lower_body: ["quadriceps", "hamstrings", "glutes", "calves", "hip_flexors"],
  core: ["core"],
};

/** Muscles associated with each movement pattern */
export const MOVEMENT_PATTERN_MUSCLES: Record<string, readonly string[]> = {
  push: ["chest", "shoulders", "triceps"],
  pull: ["back", "biceps", "lats", "traps", "forearms"],
  hip_dominant: ["glutes", "hamstrings", "hip_flexors"],
  knee_dominant: ["quadriceps", "calves"],
  core: ["core"],
};

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
  "/reset-password",
  "/auth/callback",
  "/privacy",
  "/terms",
  "/legal",
];

// Páginas legales: públicas Y accesibles con sesión iniciada
// (el middleware no debe redirigir a home desde ellas)
export const LEGAL_ROUTES = ["/privacy", "/terms", "/legal"];

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
