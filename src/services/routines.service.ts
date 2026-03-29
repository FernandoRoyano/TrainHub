import { createClient } from "@/lib/supabase/client";
import type { RoutineFormData, AssignRoutineData } from "@/lib/validations/routine";
import type { Exercise } from "./exercises.service";

export interface RoutineExercise {
  id: string;
  routine_day_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string | null;
  superset_group: number | null;
  exercise?: Exercise;
}

export interface ExerciseGroup {
  id: string;
  routine_day_id: string;
  group_type: "solo" | "superset" | "triset" | "circuit" | "emom" | "amrap";
  order_index: number;
  rounds: number | null;
  time_limit_seconds: number | null;
  rest_between_rounds: number | null;
  label: string | null;
  notes: string | null;
  exercises: RoutineExercise[];
}

export interface RoutineDay {
  id: string;
  routine_id: string;
  day_number: number;
  name: string | null;
  notes: string | null;
  description: string | null;
  exercises: RoutineExercise[];
  groups?: ExerciseGroup[];
}

export interface Routine {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  duration_weeks: number;
  days_per_week: number;
  difficulty: string | null;
  target_gender: string;
  is_template: boolean;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  days?: RoutineDay[];
}

export interface ClientRoutine {
  id: string;
  client_id: string;
  routine_id: string;
  trainer_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  routine?: Routine;
}

export interface RoutineFilters {
  search?: string;
  difficulty?: string;
  is_template?: boolean;
  page?: number;
  pageSize?: number;
}

export const routinesService = {
  async getRoutines(filters?: RoutineFilters) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("routines")
      .select("*", { count: "exact" })
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters?.is_template !== undefined) {
      query = query.eq("is_template", filters.is_template);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as Routine[], count: count ?? 0 };
  },

  async getRoutineById(id: string) {
    const supabase = createClient();

    // Get routine
    const { data: routine, error: routineError } = await supabase
      .from("routines")
      .select("*")
      .eq("id", id)
      .single();
    if (routineError) throw routineError;

    // Get days with exercises
    const { data: days, error: daysError } = await supabase
      .from("routine_days")
      .select("*")
      .eq("routine_id", id)
      .order("day_number", { ascending: true });
    if (daysError) throw daysError;

    // Get exercises for all days
    const dayIds = (days ?? []).map((d) => d.id);
    let exercises: RoutineExercise[] = [];

    if (dayIds.length > 0) {
      const { data: exData, error: exError } = await supabase
        .from("routine_exercises")
        .select("*, exercise:exercises(*)")
        .in("routine_day_id", dayIds)
        .order("order_index", { ascending: true });
      if (exError) throw exError;
      exercises = (exData ?? []) as RoutineExercise[];
    }

    // Get exercise groups
    let groups: ExerciseGroup[] = [];
    if (dayIds.length > 0) {
      const { data: groupData } = await supabase
        .from("exercise_groups")
        .select("*")
        .in("routine_day_id", dayIds)
        .order("order_index", { ascending: true });
      groups = (groupData ?? []) as ExerciseGroup[];
    }

    // Assemble
    const assembledDays: RoutineDay[] = (days ?? []).map((day) => {
      const dayExercises = exercises.filter((e) => e.routine_day_id === day.id);
      const dayGroups = groups
        .filter((g) => g.routine_day_id === day.id)
        .map((g) => ({
          ...g,
          exercises: dayExercises
            .filter((e) => (e as RoutineExercise & { exercise_group_id?: string }).exercise_group_id === g.id)
            .sort((a, b) => a.order_index - b.order_index),
        }));

      return {
        ...day,
        description: day.description ?? null,
        exercises: dayExercises,
        groups: dayGroups.length > 0 ? dayGroups : undefined,
      };
    });

    return { ...routine, days: assembledDays } as Routine;
  },

  async createRoutine(data: RoutineFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Create routine
    const { data: routine, error: routineError } = await supabase
      .from("routines")
      .insert({
        trainer_id: user.id,
        name: data.name,
        description: data.description || null,
        duration_weeks: data.duration_weeks,
        days_per_week: data.days_per_week,
        difficulty: data.difficulty,
        target_gender: data.target_gender,
        is_template: data.is_template,
        cover_image: data.cover_image || null,
      })
      .select()
      .single();
    if (routineError) throw routineError;

    // 2. Create days
    if (data.days.length > 0) {
      const daysToInsert = data.days.map((day) => ({
        routine_id: routine.id,
        day_number: day.day_number,
        name: day.name || null,
        notes: day.notes || null,
        description: day.description || null,
      }));

      const { data: insertedDays, error: daysError } = await supabase
        .from("routine_days")
        .insert(daysToInsert)
        .select();
      if (daysError) throw daysError;

      // 3. Create groups and exercises for each day
      for (const day of data.days) {
        const insertedDay = (insertedDays ?? []).find(
          (d) => d.day_number === day.day_number
        );
        if (!insertedDay) continue;

        // If day has groups, use them
        if (day.groups && day.groups.length > 0) {
          for (const group of day.groups) {
            const { data: insertedGroup, error: groupError } = await supabase
              .from("exercise_groups")
              .insert({
                routine_day_id: insertedDay.id,
                group_type: group.group_type,
                order_index: group.order_index,
                rounds: group.rounds ?? null,
                time_limit_seconds: group.time_limit_seconds ?? null,
                rest_between_rounds: group.rest_between_rounds ?? null,
                label: group.label || null,
                notes: group.notes || null,
              })
              .select()
              .single();
            if (groupError) throw groupError;

            if (group.exercises.length > 0) {
              const exToInsert = group.exercises.map((ex) => ({
                routine_day_id: insertedDay.id,
                exercise_group_id: insertedGroup.id,
                exercise_id: ex.exercise_id,
                order_index: ex.order_index,
                sets: ex.sets,
                reps: ex.reps,
                rest_seconds: ex.rest_seconds,
                notes: ex.notes || null,
                superset_group: ex.superset_group ?? null,
              }));
              const { error: exError } = await supabase
                .from("routine_exercises")
                .insert(exToInsert);
              if (exError) throw exError;
            }
          }
        } else {
          // Fallback: flat exercises (backward compat)
          const exercisesToInsert = day.exercises.map((ex) => ({
            routine_day_id: insertedDay.id,
            exercise_id: ex.exercise_id,
            order_index: ex.order_index,
            sets: ex.sets,
            reps: ex.reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes || null,
            superset_group: ex.superset_group ?? null,
          }));
          if (exercisesToInsert.length > 0) {
            const { error: exError } = await supabase
              .from("routine_exercises")
              .insert(exercisesToInsert);
            if (exError) throw exError;
          }
        }
      }
    }

    return routine as Routine;
  },

  async updateRoutine(id: string, data: RoutineFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Update routine metadata
    const { error: routineError } = await supabase
      .from("routines")
      .update({
        name: data.name,
        description: data.description || null,
        duration_weeks: data.duration_weeks,
        days_per_week: data.days_per_week,
        difficulty: data.difficulty,
        target_gender: data.target_gender,
        is_template: data.is_template,
        cover_image: data.cover_image || null,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (routineError) throw routineError;

    // 2. Delete existing days (cascades to exercises)
    const { error: deleteError } = await supabase
      .from("routine_days")
      .delete()
      .eq("routine_id", id);
    if (deleteError) throw deleteError;

    // 3. Re-create days, groups and exercises (same logic as create)
    if (data.days.length > 0) {
      const daysToInsert = data.days.map((day) => ({
        routine_id: id,
        day_number: day.day_number,
        name: day.name || null,
        notes: day.notes || null,
        description: day.description || null,
      }));

      const { data: insertedDays, error: daysError } = await supabase
        .from("routine_days")
        .insert(daysToInsert)
        .select();
      if (daysError) throw daysError;

      for (const day of data.days) {
        const insertedDay = (insertedDays ?? []).find(
          (d) => d.day_number === day.day_number
        );
        if (!insertedDay) continue;

        if (day.groups && day.groups.length > 0) {
          for (const group of day.groups) {
            const { data: insertedGroup, error: groupError } = await supabase
              .from("exercise_groups")
              .insert({
                routine_day_id: insertedDay.id,
                group_type: group.group_type,
                order_index: group.order_index,
                rounds: group.rounds ?? null,
                time_limit_seconds: group.time_limit_seconds ?? null,
                rest_between_rounds: group.rest_between_rounds ?? null,
                label: group.label || null,
                notes: group.notes || null,
              })
              .select()
              .single();
            if (groupError) throw groupError;

            if (group.exercises.length > 0) {
              const exToInsert = group.exercises.map((ex) => ({
                routine_day_id: insertedDay.id,
                exercise_group_id: insertedGroup.id,
                exercise_id: ex.exercise_id,
                order_index: ex.order_index,
                sets: ex.sets,
                reps: ex.reps,
                rest_seconds: ex.rest_seconds,
                notes: ex.notes || null,
                superset_group: ex.superset_group ?? null,
              }));
              const { error: exError } = await supabase
                .from("routine_exercises")
                .insert(exToInsert);
              if (exError) throw exError;
            }
          }
        } else {
          const exercisesToInsert = day.exercises.map((ex) => ({
            routine_day_id: insertedDay.id,
            exercise_id: ex.exercise_id,
            order_index: ex.order_index,
            sets: ex.sets,
            reps: ex.reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes || null,
            superset_group: ex.superset_group ?? null,
          }));
          if (exercisesToInsert.length > 0) {
            const { error: exError } = await supabase
              .from("routine_exercises")
              .insert(exercisesToInsert);
            if (exError) throw exError;
          }
        }
      }
    }
  },

  async deleteRoutine(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("routines")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async duplicateRoutine(id: string, copySuffix = "(copy)") {
    const routine = await this.getRoutineById(id);
    const formData: RoutineFormData = {
      name: `${routine.name} ${copySuffix}`,
      description: routine.description ?? "",
      duration_weeks: routine.duration_weeks,
      days_per_week: routine.days_per_week,
      difficulty: routine.difficulty as RoutineFormData["difficulty"],
      target_gender: routine.target_gender as RoutineFormData["target_gender"],
      is_template: routine.is_template,
      days: (routine.days ?? []).map((day) => ({
        day_number: day.day_number,
        name: day.name ?? "",
        notes: day.notes ?? "",
        exercises: day.exercises.map((ex) => ({
          exercise_id: ex.exercise_id,
          order_index: ex.order_index,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes ?? "",
          superset_group: ex.superset_group,
        })),
      })),
    };
    return this.createRoutine(formData);
  },

  async useTemplate(id: string, newName: string) {
    const routine = await this.getRoutineById(id);
    const formData: RoutineFormData = {
      name: newName,
      description: routine.description ?? "",
      duration_weeks: routine.duration_weeks,
      days_per_week: routine.days_per_week,
      difficulty: routine.difficulty as RoutineFormData["difficulty"],
      target_gender: routine.target_gender as RoutineFormData["target_gender"],
      is_template: false,
      days: (routine.days ?? []).map((day) => ({
        day_number: day.day_number,
        name: day.name ?? "",
        notes: day.notes ?? "",
        exercises: day.exercises.map((ex) => ({
          exercise_id: ex.exercise_id,
          order_index: ex.order_index,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes ?? "",
          superset_group: ex.superset_group,
        })),
      })),
    };
    return this.createRoutine(formData);
  },

  async assignToClient(data: AssignRoutineData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: assignment, error } = await supabase
      .from("client_routines")
      .insert({
        client_id: data.client_id,
        routine_id: data.routine_id,
        trainer_id: user.id,
        start_date: data.start_date,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return assignment as ClientRoutine;
  },

  async getClientRoutines(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_routines")
      .select("*, routine:routines(*)")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ClientRoutine[];
  },

  async cancelClientRoutine(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("client_routines")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async deleteClientRoutine(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("client_routines")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },
};
