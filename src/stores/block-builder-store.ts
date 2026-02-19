import { create } from "zustand";
import type { Exercise } from "@/services/exercises.service";

export interface BlockBuilderExercise {
  id: string;
  exercise_id: string;
  exercise?: Exercise;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
  superset_group: number | null;
}

interface BlockBuilderState {
  exercises: BlockBuilderExercise[];

  setExercises: (exercises: BlockBuilderExercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (index: number) => void;
  updateExercise: (index: number, data: Partial<BlockBuilderExercise>) => void;
  moveExercise: (from: number, to: number) => void;
  toggleSuperset: (index: number) => void;
  reset: () => void;
}

let idCounter = 0;
const tempId = () => `block_temp_${++idCounter}`;

export const useBlockBuilderStore = create<BlockBuilderState>((set, get) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  addExercise: (exercise) => {
    const { exercises } = get();
    const newEx: BlockBuilderExercise = {
      id: tempId(),
      exercise_id: exercise.id,
      exercise,
      order_index: exercises.length,
      sets: 3,
      reps: "10",
      rest_seconds: 60,
      notes: "",
      superset_group: null,
    };
    set({ exercises: [...exercises, newEx] });
  },

  removeExercise: (index) => {
    const { exercises } = get();
    const newExercises = exercises
      .filter((_, i) => i !== index)
      .map((e, i) => ({ ...e, order_index: i }));
    set({ exercises: newExercises });
  },

  updateExercise: (index, data) => {
    const { exercises } = get();
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], ...data };
    set({ exercises: newExercises });
  },

  moveExercise: (from, to) => {
    const { exercises } = get();
    if (to < 0 || to >= exercises.length) return;
    const newExercises = [...exercises];
    const [moved] = newExercises.splice(from, 1);
    newExercises.splice(to, 0, moved);
    const reindexed = newExercises.map((e, i) => ({ ...e, order_index: i }));
    set({ exercises: reindexed });
  },

  toggleSuperset: (index) => {
    const { exercises } = get();
    const exercise = exercises[index];
    if (!exercise) return;

    if (exercise.superset_group !== null) {
      const newExercises = [...exercises];
      newExercises[index] = { ...exercise, superset_group: null };
      set({ exercises: newExercises });
      return;
    }

    if (index === 0) return;
    const prev = exercises[index - 1];
    const groupId = prev.superset_group ?? index;

    const newExercises = [...exercises];
    newExercises[index - 1] = { ...prev, superset_group: groupId };
    newExercises[index] = { ...exercise, superset_group: groupId };
    set({ exercises: newExercises });
  },

  reset: () => {
    idCounter = 0;
    set({ exercises: [] });
  },
}));
