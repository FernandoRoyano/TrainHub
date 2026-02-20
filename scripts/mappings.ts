/**
 * Mappings from Free Exercise DB values to our internal constants.
 * Used by the import script (import-exercises.ts).
 */

// Free Exercise DB muscle names → our muscle_groups constants
export const MUSCLE_MAP: Record<string, string> = {
  "Abdominals": "core",
  "Abductors": "hip_flexors",
  "Adductors": "hip_flexors",
  "Biceps": "biceps",
  "Calves": "calves",
  "Chest": "chest",
  "Forearms": "forearms",
  "Glutes": "glutes",
  "Hamstrings": "hamstrings",
  "Lats": "lats",
  "Lower Back": "back",
  "Middle Back": "back",
  "Traps": "traps",
  "Neck": "traps",
  "Quadriceps": "quadriceps",
  "Shoulders": "shoulders",
  "Triceps": "triceps",
};

// Free Exercise DB equipment → our equipment constants
export const EQUIPMENT_MAP: Record<string, string> = {
  "Barbell": "barbell",
  "Dumbbell": "dumbbell",
  "Cable": "cable",
  "Machine": "machine",
  "Body Only": "bodyweight",
  "Kettlebells": "kettlebell",
  "Bands": "band",
  "E-Z Curl Bar": "ez_bar",
  "Other": "bodyweight",
  "Exercise Ball": "bodyweight",
  "Foam Roll": "bodyweight",
  "Medicine Ball": "bodyweight",
  "None": "bodyweight",
};

// Free Exercise DB category → our category + exercise_type
export const CATEGORY_MAP: Record<string, { category: string; exercise_type: string }> = {
  "Strength": { category: "strength", exercise_type: "compound" },
  "Stretching": { category: "flexibility", exercise_type: "stretching" },
  "Plyometrics": { category: "strength", exercise_type: "plyometric" },
  "Powerlifting": { category: "strength", exercise_type: "compound" },
  "Olympic Weightlifting": { category: "strength", exercise_type: "compound" },
  "Strongman": { category: "strength", exercise_type: "compound" },
  "Cardio": { category: "cardio", exercise_type: "cardio" },
};

// Free Exercise DB difficulty/level → our difficulty
export const DIFFICULTY_MAP: Record<string, string> = {
  "Beginner": "beginner",
  "Intermediate": "intermediate",
  "Expert": "advanced",
};

// Free Exercise DB mechanics → our mechanics
export const MECHANICS_MAP: Record<string, string> = {
  "Compound": "compound",
  "Isolation": "isolation",
};

// Free Exercise DB force → our force
export const FORCE_MAP: Record<string, string> = {
  "Push": "push",
  "Pull": "pull",
  "Static": "static",
};

/**
 * Deduplicate an array of mapped muscle names.
 * E.g., "Lower Back" and "Middle Back" both map to "back".
 */
export function uniqueMuscles(muscles: string[]): string[] {
  return Array.from(new Set(muscles.map((m) => MUSCLE_MAP[m]).filter(Boolean)));
}
