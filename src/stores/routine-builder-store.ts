import { create } from "zustand";
import type { Exercise } from "@/services/exercises.service";
import type { BlockExercise } from "@/services/blocks.service";

export interface BuilderExercise {
  id: string; // temp id for UI
  exercise_id: string;
  exercise?: Exercise;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
  superset_group: number | null;
}

export interface BuilderDay {
  id: string; // temp id for UI
  day_number: number;
  name: string;
  notes: string;
  exercises: BuilderExercise[];
}

interface RoutineBuilderState {
  days: BuilderDay[];
  activeDayIndex: number;

  // Day actions
  setDays: (days: BuilderDay[]) => void;
  addDay: () => void;
  removeDay: (index: number) => void;
  updateDay: (index: number, data: Partial<BuilderDay>) => void;
  setActiveDayIndex: (index: number) => void;

  // Exercise actions
  addExercise: (dayIndex: number, exercise: Exercise) => void;
  removeExercise: (dayIndex: number, exerciseIndex: number) => void;
  updateExercise: (
    dayIndex: number,
    exerciseIndex: number,
    data: Partial<BuilderExercise>
  ) => void;
  moveExercise: (dayIndex: number, from: number, to: number) => void;
  toggleSuperset: (dayIndex: number, exerciseIndex: number) => void;
  addExercisesFromBlock: (dayIndex: number, blockExercises: BlockExercise[]) => void;
  reorderExercise: (dayIndex: number, oldIndex: number, newIndex: number) => void;

  // Reset
  reset: () => void;
}

let idCounter = 0;
const tempId = () => `temp_${++idCounter}`;

const createEmptyDay = (dayNumber: number): BuilderDay => ({
  id: tempId(),
  day_number: dayNumber,
  name: "",
  notes: "",
  exercises: [],
});

export const useRoutineBuilderStore = create<RoutineBuilderState>(
  (set, get) => ({
    days: [createEmptyDay(1)],
    activeDayIndex: 0,

    setDays: (days) => set({ days, activeDayIndex: 0 }),

    addDay: () => {
      const { days } = get();
      const newDay = createEmptyDay(days.length + 1);
      set({ days: [...days, newDay], activeDayIndex: days.length });
    },

    removeDay: (index) => {
      const { days, activeDayIndex } = get();
      if (days.length <= 1) return;
      const newDays = days
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day_number: i + 1 }));
      const newActive = Math.min(activeDayIndex, newDays.length - 1);
      set({ days: newDays, activeDayIndex: newActive });
    },

    updateDay: (index, data) => {
      const { days } = get();
      const newDays = [...days];
      newDays[index] = { ...newDays[index], ...data };
      set({ days: newDays });
    },

    setActiveDayIndex: (index) => set({ activeDayIndex: index }),

    addExercise: (dayIndex, exercise) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newExercise: BuilderExercise = {
        id: tempId(),
        exercise_id: exercise.id,
        exercise,
        order_index: day.exercises.length,
        sets: 3,
        reps: "10",
        rest_seconds: 60,
        notes: "",
        superset_group: null,
      };

      const newDays = [...days];
      newDays[dayIndex] = {
        ...day,
        exercises: [...day.exercises, newExercise],
      };
      set({ days: newDays });
    },

    removeExercise: (dayIndex, exerciseIndex) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newExercises = day.exercises
        .filter((_, i) => i !== exerciseIndex)
        .map((e, i) => ({ ...e, order_index: i }));

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: newExercises };
      set({ days: newDays });
    },

    updateExercise: (dayIndex, exerciseIndex, data) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newExercises = [...day.exercises];
      newExercises[exerciseIndex] = {
        ...newExercises[exerciseIndex],
        ...data,
      };

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: newExercises };
      set({ days: newDays });
    },

    moveExercise: (dayIndex, from, to) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;
      if (to < 0 || to >= day.exercises.length) return;

      const newExercises = [...day.exercises];
      const [moved] = newExercises.splice(from, 1);
      newExercises.splice(to, 0, moved);
      const reindexed = newExercises.map((e, i) => ({
        ...e,
        order_index: i,
      }));

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: reindexed };
      set({ days: newDays });
    },

    toggleSuperset: (dayIndex, exerciseIndex) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const exercise = day.exercises[exerciseIndex];
      if (!exercise) return;

      // If already in a superset, remove it
      if (exercise.superset_group !== null) {
        const newExercises = [...day.exercises];
        newExercises[exerciseIndex] = {
          ...exercise,
          superset_group: null,
        };
        const newDays = [...days];
        newDays[dayIndex] = { ...day, exercises: newExercises };
        set({ days: newDays });
        return;
      }

      // Create superset with previous exercise
      if (exerciseIndex === 0) return;
      const prevExercise = day.exercises[exerciseIndex - 1];
      const groupId =
        prevExercise.superset_group ?? exerciseIndex;

      const newExercises = [...day.exercises];
      newExercises[exerciseIndex - 1] = {
        ...prevExercise,
        superset_group: groupId,
      };
      newExercises[exerciseIndex] = {
        ...exercise,
        superset_group: groupId,
      };

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: newExercises };
      set({ days: newDays });
    },

    addExercisesFromBlock: (dayIndex, blockExercises) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newExercises = blockExercises.map((bex, i) => ({
        id: tempId(),
        exercise_id: bex.exercise_id,
        exercise: bex.exercise,
        order_index: day.exercises.length + i,
        sets: bex.sets,
        reps: bex.reps,
        rest_seconds: bex.rest_seconds,
        notes: bex.notes ?? "",
        superset_group: bex.superset_group,
      }));

      const newDays = [...days];
      newDays[dayIndex] = {
        ...day,
        exercises: [...day.exercises, ...newExercises],
      };
      set({ days: newDays });
    },

    reorderExercise: (dayIndex, oldIndex, newIndex) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;
      if (newIndex < 0 || newIndex >= day.exercises.length) return;

      const newExercises = [...day.exercises];
      const [moved] = newExercises.splice(oldIndex, 1);
      newExercises.splice(newIndex, 0, moved);
      const reindexed = newExercises.map((e, i) => ({
        ...e,
        order_index: i,
      }));

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: reindexed };
      set({ days: newDays });
    },

    reset: () => {
      idCounter = 0;
      set({ days: [createEmptyDay(1)], activeDayIndex: 0 });
    },
  })
);
