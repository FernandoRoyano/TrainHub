import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SetDetail {
  reps: string;
  weight: string;
  note: string;
}

interface ExerciseEntry {
  sets: number;
  weight: string;
  reps: string;
  feedback: string;
  setDetails?: SetDetail[];
}

interface WorkoutSessionState {
  activeWorkoutId: string | null;
  workoutStartedAt: string | null;
  exerciseData: Record<string, ExerciseEntry>;
  workoutNotes: string;
  loggedExercises: string[];
  selectedDayIndex: number;

  startSession: (workoutId: string) => void;
  endSession: () => void;
  setExerciseData: (exerciseId: string, data: ExerciseEntry) => void;
  updateExerciseData: (exerciseId: string, partial: Partial<ExerciseEntry>) => void;
  setWorkoutNotes: (notes: string) => void;
  markExerciseLogged: (exerciseId: string) => void;
  setSelectedDayIndex: (index: number) => void;
  isExerciseLogged: (exerciseId: string) => boolean;
}

export const useWorkoutSessionStore = create<WorkoutSessionState>()(
  persist(
    (set, get) => ({
      activeWorkoutId: null,
      workoutStartedAt: null,
      exerciseData: {},
      workoutNotes: "",
      loggedExercises: [],
      selectedDayIndex: 0,

      startSession: (workoutId) =>
        set({
          activeWorkoutId: workoutId,
          workoutStartedAt: new Date().toISOString(),
          exerciseData: {},
          workoutNotes: "",
          loggedExercises: [],
        }),

      endSession: () =>
        set({
          activeWorkoutId: null,
          workoutStartedAt: null,
          exerciseData: {},
          workoutNotes: "",
          loggedExercises: [],
        }),

      setExerciseData: (exerciseId, data) =>
        set((s) => ({
          exerciseData: { ...s.exerciseData, [exerciseId]: data },
        })),

      updateExerciseData: (exerciseId, partial) =>
        set((s) => ({
          exerciseData: {
            ...s.exerciseData,
            [exerciseId]: { ...s.exerciseData[exerciseId], ...partial },
          },
        })),

      setWorkoutNotes: (notes) => set({ workoutNotes: notes }),

      markExerciseLogged: (exerciseId) =>
        set((s) => ({
          loggedExercises: s.loggedExercises.includes(exerciseId)
            ? s.loggedExercises
            : [...s.loggedExercises, exerciseId],
        })),

      setSelectedDayIndex: (index) => set({ selectedDayIndex: index }),

      isExerciseLogged: (exerciseId) => get().loggedExercises.includes(exerciseId),
    }),
    {
      name: "trainhub-workout-session",
    }
  )
);
