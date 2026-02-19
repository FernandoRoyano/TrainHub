import { createClient } from "@/lib/supabase/client";
import type { Routine, RoutineDay, RoutineExercise } from "./routines.service";
import type { BodyMeasurement } from "./measurements.service";

export interface ClientRoutineView {
  id: string;
  client_id: string;
  routine_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  routine: Routine & { days: RoutineDay[] };
}

export interface WorkoutLog {
  id: string;
  client_id: string;
  client_routine_id: string;
  routine_day_id: string;
  date: string;
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  workout_log_id: string;
  routine_exercise_id: string;
  sets_completed: number;
  weight_used: number | null;
  reps_completed: string | null;
  notes: string | null;
}

async function getAuthenticatedClient() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!client) throw new Error("No client record found");

  return { supabase, clientId: client.id };
}

export const clientAppService = {
  async getMyClientRecord() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (error) throw error;
    return data;
  },

  async getMyActiveRoutine() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get client record
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) return null;

    // Get active assignment
    const { data: assignment, error: assignError } = await supabase
      .from("client_routines")
      .select("*")
      .eq("client_id", client.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (assignError) throw assignError;
    if (!assignment) return null;

    // Get routine with days and exercises
    const { data: routine, error: routineError } = await supabase
      .from("routines")
      .select("*")
      .eq("id", assignment.routine_id)
      .single();
    if (routineError) throw routineError;

    const { data: days } = await supabase
      .from("routine_days")
      .select("*")
      .eq("routine_id", routine.id)
      .order("day_number");

    const dayIds = (days ?? []).map((d) => d.id);
    let exercises: RoutineExercise[] = [];
    if (dayIds.length > 0) {
      const { data: exData } = await supabase
        .from("routine_exercises")
        .select("*, exercise:exercises(*)")
        .in("routine_day_id", dayIds)
        .order("order_index");
      exercises = (exData ?? []) as RoutineExercise[];
    }

    const assembledDays = (days ?? []).map((day) => ({
      ...day,
      exercises: exercises.filter((e) => e.routine_day_id === day.id),
    }));

    return {
      ...assignment,
      routine: { ...routine, days: assembledDays },
    } as ClientRoutineView;
  },

  async getWorkoutLogs(clientRoutineId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("workout_logs")
      .select("*")
      .eq("client_routine_id", clientRoutineId)
      .eq("client_id", clientId)
      .order("date", { ascending: false });
    if (error) throw error;
    return data as WorkoutLog[];
  },

  async getExerciseLogs(workoutLogId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();

    // Verify workout belongs to this client
    const { data: wl } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("id", workoutLogId)
      .eq("client_id", clientId)
      .single();
    if (!wl) throw new Error("Not authorized");

    const { data, error } = await supabase
      .from("exercise_logs")
      .select("*")
      .eq("workout_log_id", workoutLogId);
    if (error) throw error;
    return data as ExerciseLog[];
  },

  async startWorkout(_clientId: string, clientRoutineId: string, routineDayId: string) {
    const { supabase, clientId: authClientId } = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("workout_logs")
      .insert({
        client_id: authClientId,
        client_routine_id: clientRoutineId,
        routine_day_id: routineDayId,
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();
    if (error) throw error;
    return data as WorkoutLog;
  },

  async completeWorkout(workoutLogId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();
    const { error } = await supabase
      .from("workout_logs")
      .update({ completed: true })
      .eq("id", workoutLogId)
      .eq("client_id", clientId);
    if (error) throw error;
  },

  async logExercise(
    workoutLogId: string,
    routineExerciseId: string,
    data: { sets_completed: number; weight_used?: number; reps_completed?: string }
  ) {
    const { supabase, clientId } = await getAuthenticatedClient();

    // Verify workout belongs to this client
    const { data: wl } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("id", workoutLogId)
      .eq("client_id", clientId)
      .single();
    if (!wl) throw new Error("Not authorized");

    const { data: log, error } = await supabase
      .from("exercise_logs")
      .upsert(
        {
          workout_log_id: workoutLogId,
          routine_exercise_id: routineExerciseId,
          ...data,
        },
        { onConflict: "workout_log_id,routine_exercise_id", ignoreDuplicates: false }
      )
      .select()
      .single();
    if (error) {
      // If upsert fails (no unique constraint), try insert
      const { data: inserted, error: insertError } = await supabase
        .from("exercise_logs")
        .insert({
          workout_log_id: workoutLogId,
          routine_exercise_id: routineExerciseId,
          ...data,
        })
        .select()
        .single();
      if (insertError) throw insertError;
      return inserted as ExerciseLog;
    }
    return log as ExerciseLog;
  },

  async getMyMeasurements() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) return [];

    const { data, error } = await supabase
      .from("body_measurements")
      .select("*")
      .eq("client_id", client.id)
      .order("date", { ascending: true });
    if (error) throw error;
    return data as BodyMeasurement[];
  },

  async getProgressData(clientRoutineId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: workouts, error } = await supabase
      .from("workout_logs")
      .select("*, exercise_logs:exercise_logs(*, routine_exercise:routine_exercises(*, exercise:exercises(name)))")
      .eq("client_routine_id", clientRoutineId)
      .eq("client_id", clientId)
      .eq("completed", true)
      .order("date", { ascending: true });

    if (error) throw error;
    return workouts as WorkoutWithExercises[];
  },
};

export interface WorkoutWithExercises extends WorkoutLog {
  exercise_logs: (ExerciseLog & {
    routine_exercise: {
      id: string;
      exercise: { name: string } | null;
    } | null;
  })[];
}
