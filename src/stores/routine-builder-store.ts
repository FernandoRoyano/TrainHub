import { create } from "zustand";
import type { Exercise } from "@/services/exercises.service";
import type { BlockExercise } from "@/services/blocks.service";

export type GroupType = 'solo' | 'superset' | 'triset' | 'circuit' | 'emom' | 'amrap';

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

export interface BuilderGroup {
  id: string;
  group_type: GroupType;
  order_index: number;
  rounds: number | null;
  time_limit_seconds: number | null;
  rest_between_rounds: number | null;
  label: string;
  notes: string;
  exercises: BuilderExercise[];
}

export interface BuilderDay {
  id: string; // temp id for UI
  day_number: number;
  name: string;
  notes: string;
  description: string;
  exercises: BuilderExercise[];
  groups: BuilderGroup[];
}

/** Input type for setDays - description and groups are optional for backward compat */
export type BuilderDayInput = Omit<BuilderDay, 'description' | 'groups'> & {
  description?: string;
  groups?: BuilderGroup[];
};

interface RoutineBuilderState {
  days: BuilderDay[];
  activeDayIndex: number;

  // Day actions
  setDays: (days: BuilderDayInput[]) => void;
  addDay: () => void;
  removeDay: (index: number) => void;
  updateDay: (index: number, data: Partial<BuilderDay>) => void;
  updateDayDescription: (dayIndex: number, description: string) => void;
  setActiveDayIndex: (index: number) => void;

  // Exercise actions (backward compatible - operates on flat exercises + auto-creates solo groups)
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

  // Group actions
  addGroup: (dayIndex: number, groupType: GroupType) => void;
  removeGroup: (dayIndex: number, groupIndex: number) => void;
  updateGroup: (dayIndex: number, groupIndex: number, data: Partial<BuilderGroup>) => void;
  addExerciseToGroup: (dayIndex: number, groupIndex: number, exercise: Exercise) => void;
  changeGroupType: (dayIndex: number, groupIndex: number, newType: GroupType) => void;

  // Reset
  reset: () => void;
}

let idCounter = 0;
const tempId = () => `temp_${++idCounter}`;

const createEmptyGroup = (orderIndex: number, groupType: GroupType = 'solo'): BuilderGroup => ({
  id: tempId(),
  group_type: groupType,
  order_index: orderIndex,
  rounds: null,
  time_limit_seconds: null,
  rest_between_rounds: null,
  label: '',
  notes: '',
  exercises: [],
});

const createSoloGroup = (exercise: BuilderExercise, orderIndex: number): BuilderGroup => ({
  ...createEmptyGroup(orderIndex, 'solo'),
  exercises: [exercise],
});

/**
 * Convert a flat exercises array (with optional superset_group) into BuilderGroup[].
 * Exercises sharing the same superset_group number become a 'superset' group;
 * exercises with superset_group === null each get their own 'solo' group.
 */
const exercisesToGroups = (exercises: BuilderExercise[]): BuilderGroup[] => {
  const groups: BuilderGroup[] = [];
  const supersetMap = new Map<number, BuilderExercise[]>();
  const soloExercises: { exercise: BuilderExercise; originalIndex: number }[] = [];

  exercises.forEach((ex, idx) => {
    if (ex.superset_group !== null) {
      if (!supersetMap.has(ex.superset_group)) {
        supersetMap.set(ex.superset_group, []);
      }
      supersetMap.get(ex.superset_group)!.push(ex);
    } else {
      soloExercises.push({ exercise: ex, originalIndex: idx });
    }
  });

  // We need to reconstruct groups in the order they appear in the exercises array
  let groupOrder = 0;
  const processed = new Set<number>();
  exercises.forEach((ex) => {
    if (ex.superset_group !== null && !processed.has(ex.superset_group)) {
      processed.add(ex.superset_group);
      const groupExercises = supersetMap.get(ex.superset_group)!;
      const groupType: GroupType = groupExercises.length >= 3 ? 'triset' : 'superset';
      groups.push({
        ...createEmptyGroup(groupOrder, groupType),
        exercises: groupExercises.map((e, i) => ({ ...e, order_index: i })),
      });
      groupOrder++;
    } else if (ex.superset_group === null) {
      groups.push(createSoloGroup({ ...ex, order_index: 0 }, groupOrder));
      groupOrder++;
    }
  });

  return groups;
};

/** Flatten groups back to a flat exercises array (for backward compat) */
const groupsToExercises = (groups: BuilderGroup[]): BuilderExercise[] => {
  const exercises: BuilderExercise[] = [];
  let orderIndex = 0;
  groups.forEach((group) => {
    const supersetId = group.group_type !== 'solo' ? group.order_index : null;
    group.exercises.forEach((ex) => {
      exercises.push({
        ...ex,
        order_index: orderIndex++,
        superset_group: supersetId,
      });
    });
  });
  return exercises;
};

const createEmptyDay = (dayNumber: number): BuilderDay => ({
  id: tempId(),
  day_number: dayNumber,
  name: "",
  notes: "",
  description: "",
  exercises: [],
  groups: [],
});

export const useRoutineBuilderStore = create<RoutineBuilderState>(
  (set, get) => ({
    days: [createEmptyDay(1)],
    activeDayIndex: 0,

    setDays: (inputDays) => {
      const normalized: BuilderDay[] = inputDays.map((day) => {
        // If the day already has groups, use them; otherwise convert flat exercises
        const groups = day.groups && day.groups.length > 0
          ? day.groups
          : exercisesToGroups(day.exercises || []);
        // Keep the flat exercises array in sync
        const exercises = groupsToExercises(groups);
        return {
          ...day,
          description: day.description ?? '',
          groups,
          exercises,
        };
      });
      set({ days: normalized, activeDayIndex: 0 });
    },

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

    updateDayDescription: (dayIndex, description) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;
      const newDays = [...days];
      newDays[dayIndex] = { ...day, description };
      set({ days: newDays });
    },

    addExercise: (dayIndex, exercise) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newExercise: BuilderExercise = {
        id: tempId(),
        exercise_id: exercise.id,
        exercise,
        order_index: 0,
        sets: 3,
        reps: "10",
        rest_seconds: 60,
        notes: "",
        superset_group: null,
      };

      // Create a solo group for this exercise
      const newGroup = createSoloGroup(newExercise, day.groups.length);

      const newGroups = [...day.groups, newGroup];
      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = {
        ...day,
        groups: newGroups,
        exercises: newExercises,
      };
      set({ days: newDays });
    },

    removeExercise: (dayIndex, exerciseIndex) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      // Find which group/exercise this flat index maps to
      const targetExercise = day.exercises[exerciseIndex];
      if (!targetExercise) return;

      let newGroups = day.groups.map((group) => {
        const filtered = group.exercises.filter((e) => e.id !== targetExercise.id);
        if (filtered.length === group.exercises.length) return group;
        return {
          ...group,
          exercises: filtered.map((e, i) => ({ ...e, order_index: i })),
        };
      });

      // Remove empty groups
      newGroups = newGroups
        .filter((g) => g.exercises.length > 0)
        .map((g, i) => ({ ...g, order_index: i }));

      // Downgrade superset/triset groups that lost members
      newGroups = newGroups.map((g) => {
        if (g.group_type === 'superset' && g.exercises.length < 2) {
          return { ...g, group_type: 'solo' as GroupType };
        }
        if (g.group_type === 'triset' && g.exercises.length < 3) {
          if (g.exercises.length < 2) return { ...g, group_type: 'solo' as GroupType };
          return { ...g, group_type: 'superset' as GroupType };
        }
        return g;
      });

      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups, exercises: newExercises };
      set({ days: newDays });
    },

    updateExercise: (dayIndex, exerciseIndex, data) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const targetExercise = day.exercises[exerciseIndex];
      if (!targetExercise) return;

      // Update in groups
      const newGroups = day.groups.map((group) => ({
        ...group,
        exercises: group.exercises.map((e) =>
          e.id === targetExercise.id ? { ...e, ...data } : e
        ),
      }));

      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups, exercises: newExercises };
      set({ days: newDays });
    },

    moveExercise: (dayIndex, from, to) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;
      if (to < 0 || to >= day.exercises.length) return;

      // Move operates on the flat exercises list, then rebuild groups
      const newExercises = [...day.exercises];
      const [moved] = newExercises.splice(from, 1);
      newExercises.splice(to, 0, moved);
      const reindexed = newExercises.map((e, i) => ({
        ...e,
        order_index: i,
      }));

      const newGroups = exercisesToGroups(reindexed);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: reindexed, groups: newGroups };
      set({ days: newDays });
    },

    toggleSuperset: (dayIndex, exerciseIndex) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const exercise = day.exercises[exerciseIndex];
      if (!exercise) return;

      // Find which group this exercise belongs to
      const groupIdx = day.groups.findIndex((g) =>
        g.exercises.some((e) => e.id === exercise.id)
      );
      if (groupIdx === -1) return;

      const group = day.groups[groupIdx];

      // If already in a non-solo group, split this exercise out into its own solo group
      if (group.group_type !== 'solo') {
        const remaining = group.exercises.filter((e) => e.id !== exercise.id);
        const newGroups = [...day.groups];

        if (remaining.length === 0) {
          // Group is now empty, just convert to solo
          newGroups[groupIdx] = { ...group, group_type: 'solo' };
        } else {
          // Determine new type for remaining group
          let newType: GroupType = remaining.length >= 3 ? 'triset' : remaining.length >= 2 ? 'superset' : 'solo';
          // Keep non-superset/triset types (circuit, emom, amrap) as they are
          if (!['superset', 'triset', 'solo'].includes(group.group_type)) {
            newType = group.group_type;
          }
          newGroups[groupIdx] = {
            ...group,
            group_type: newType,
            exercises: remaining.map((e, i) => ({ ...e, order_index: i })),
          };
          // Insert a new solo group right after
          const soloGroup = createSoloGroup({ ...exercise, order_index: 0 }, 0);
          newGroups.splice(groupIdx + 1, 0, soloGroup);
        }

        // Reindex groups
        const reindexed = newGroups.map((g, i) => ({ ...g, order_index: i }));
        const newExercises = groupsToExercises(reindexed);

        const newDays = [...days];
        newDays[dayIndex] = { ...day, groups: reindexed, exercises: newExercises };
        set({ days: newDays });
        return;
      }

      // Currently solo - merge with previous group
      if (groupIdx === 0) return;

      const prevGroup = day.groups[groupIdx - 1];
      const mergedExercises = [
        ...prevGroup.exercises,
        ...group.exercises.map((e, i) => ({
          ...e,
          order_index: prevGroup.exercises.length + i,
        })),
      ];

      const totalExercises = mergedExercises.length;
      const mergedType: GroupType = totalExercises >= 3 ? 'triset' : 'superset';

      const newGroups = [...day.groups];
      newGroups[groupIdx - 1] = {
        ...prevGroup,
        group_type: mergedType,
        exercises: mergedExercises,
      };
      newGroups.splice(groupIdx, 1);

      // Reindex groups
      const reindexed = newGroups.map((g, i) => ({ ...g, order_index: i }));
      const newExercises = groupsToExercises(reindexed);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: reindexed, exercises: newExercises };
      set({ days: newDays });
    },

    addExercisesFromBlock: (dayIndex, blockExercises) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newBlockExercises: BuilderExercise[] = blockExercises.map((bex, i) => ({
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

      // Convert block exercises into groups and append
      const blockGroups = exercisesToGroups(newBlockExercises);
      const newGroups = [
        ...day.groups,
        ...blockGroups.map((g, i) => ({ ...g, order_index: day.groups.length + i })),
      ];
      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = {
        ...day,
        groups: newGroups,
        exercises: newExercises,
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

      const newGroups = exercisesToGroups(reindexed);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, exercises: reindexed, groups: newGroups };
      set({ days: newDays });
    },

    // --- Group actions ---

    addGroup: (dayIndex, groupType) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newGroup = createEmptyGroup(day.groups.length, groupType);
      const newGroups = [...day.groups, newGroup];

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups };
      set({ days: newDays });
    },

    removeGroup: (dayIndex, groupIndex) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day) return;

      const newGroups = day.groups
        .filter((_, i) => i !== groupIndex)
        .map((g, i) => ({ ...g, order_index: i }));
      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups, exercises: newExercises };
      set({ days: newDays });
    },

    updateGroup: (dayIndex, groupIndex, data) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day || !day.groups[groupIndex]) return;

      const newGroups = [...day.groups];
      newGroups[groupIndex] = { ...newGroups[groupIndex], ...data };

      // If exercises were updated in the group data, sync flat list
      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups, exercises: newExercises };
      set({ days: newDays });
    },

    addExerciseToGroup: (dayIndex, groupIndex, exercise) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day || !day.groups[groupIndex]) return;

      const group = day.groups[groupIndex];
      const newExercise: BuilderExercise = {
        id: tempId(),
        exercise_id: exercise.id,
        exercise,
        order_index: group.exercises.length,
        sets: 3,
        reps: "10",
        rest_seconds: 60,
        notes: "",
        superset_group: null,
      };

      const newGroups = [...day.groups];
      newGroups[groupIndex] = {
        ...group,
        exercises: [...group.exercises, newExercise],
      };

      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups, exercises: newExercises };
      set({ days: newDays });
    },

    changeGroupType: (dayIndex, groupIndex, newType) => {
      const { days } = get();
      const day = days[dayIndex];
      if (!day || !day.groups[groupIndex]) return;

      const newGroups = [...day.groups];
      newGroups[groupIndex] = { ...newGroups[groupIndex], group_type: newType };

      const newExercises = groupsToExercises(newGroups);

      const newDays = [...days];
      newDays[dayIndex] = { ...day, groups: newGroups, exercises: newExercises };
      set({ days: newDays });
    },

    reset: () => {
      idCounter = 0;
      set({ days: [createEmptyDay(1)], activeDayIndex: 0 });
    },
  })
);
