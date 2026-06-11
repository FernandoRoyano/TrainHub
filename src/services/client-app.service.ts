import { createClient } from "@/lib/supabase/client";
import { localDateString } from "@/lib/local-date";
import type { Routine, RoutineDay, RoutineExercise, ExerciseGroup } from "./routines.service";
import type { BodyMeasurement } from "./measurements.service";
import type { MealPlan, MealPlanMeal, MealFood } from "./nutrition.service";
import type { ClientQuestionnaire, QuestionnaireQuestion, QuestionnaireResponse } from "./questionnaires.service";
import type { ClientServiceTier } from "./service-tiers.service";

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
  completed_at: string | null;
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

    // Fetch routine + days in parallel
    const [routineResult, daysResult] = await Promise.all([
      supabase
        .from("routines")
        .select("*")
        .eq("id", assignment.routine_id)
        .single(),
      supabase
        .from("routine_days")
        .select("*")
        .eq("routine_id", assignment.routine_id)
        .order("day_number"),
    ]);
    if (routineResult.error) throw routineResult.error;
    const routine = routineResult.data;
    const days = daysResult.data;

    const dayIds = (days ?? []).map((d) => d.id);
    let exercises: RoutineExercise[] = [];
    let groups: ExerciseGroup[] = [];
    if (dayIds.length > 0) {
      const [exResult, groupResult] = await Promise.all([
        supabase
          .from("routine_exercises")
          .select("*, exercise:exercises(*)")
          .in("routine_day_id", dayIds)
          .order("order_index"),
        supabase
          .from("exercise_groups")
          .select("*")
          .in("routine_day_id", dayIds)
          .order("order_index", { ascending: true }),
      ]);
      exercises = (exResult.data ?? []) as RoutineExercise[];
      groups = (groupResult.data ?? []) as ExerciseGroup[];
    }

    const assembledDays = (days ?? []).map((day) => {
      const dayExercises = exercises.filter((e) => e.routine_day_id === day.id);
      const dayGroups: ExerciseGroup[] = groups
        .filter((g) => g.routine_day_id === day.id)
        .map((g) => ({
          ...g,
          exercises: dayExercises
            .filter((e) => (e as RoutineExercise & { exercise_group_id?: string }).exercise_group_id === g.id)
            .sort((a, b) => a.order_index - b.order_index),
        }));

      // Wrap orphan exercises (missing exercise_group_id OR pointing to a
      // non-existent group) in synthetic solo groups so nothing disappears.
      const validGroupIds = new Set(dayGroups.map((g) => g.id));
      const orphanExercises = dayExercises
        .filter((e) => {
          const gid = (e as RoutineExercise & { exercise_group_id?: string }).exercise_group_id;
          return !gid || !validGroupIds.has(gid);
        })
        .sort((a, b) => a.order_index - b.order_index);

      if (orphanExercises.length > 0) {
        const maxOrderIndex = dayGroups.reduce(
          (max, g) => Math.max(max, g.order_index ?? 0),
          -1
        );
        orphanExercises.forEach((ex, i) => {
          dayGroups.push({
            id: `synthetic-solo-${ex.id}`,
            routine_day_id: day.id,
            group_type: "solo",
            order_index: maxOrderIndex + 1 + i,
            rounds: null,
            time_limit_seconds: null,
            rest_between_rounds: null,
            label: null,
            notes: null,
            exercises: [ex],
          });
        });
        dayGroups.sort((a, b) => a.order_index - b.order_index);
      }

      return {
        ...day,
        description: day.description ?? null,
        exercises: dayExercises,
        groups: dayGroups.length > 0 ? dayGroups : undefined,
      };
    });

    return {
      ...assignment,
      routine: { ...routine, days: assembledDays },
    } as ClientRoutineView;
  },

  subscribeToRoutineChanges(routineId: string, clientRoutineId: string, onChange: () => void) {
    const supabase = createClient();
    const channel = supabase
      .channel(`my-routine:${clientRoutineId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routines", filter: `id=eq.${routineId}` },
        () => onChange()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routine_days", filter: `routine_id=eq.${routineId}` },
        () => onChange()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "routine_exercises" },
        () => onChange()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "exercise_groups" },
        () => onChange()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "client_routines", filter: `id=eq.${clientRoutineId}` },
        () => onChange()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async getWorkoutLogs(clientRoutineId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();
    const { data, error } = await supabase
      .from("workout_logs")
      .select("*, exercise_logs(*)")
      .eq("client_routine_id", clientRoutineId)
      .eq("client_id", clientId)
      .order("date", { ascending: false });
    if (error) throw error;
    return data as (WorkoutLog & { exercise_logs?: ExerciseLog[] })[];
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
        // Fecha LOCAL: con toISOString(), entrenar entre las 00:00 y la 01:00
        // (España) registraba el entreno en el día anterior
        date: localDateString(),
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data as WorkoutLog;
  },

  async completeWorkout(workoutLogId: string, notes?: string, customDate?: string) {
    const { supabase, clientId } = await getAuthenticatedClient();

    // Get started_at to calculate duration
    const { data: wl } = await supabase
      .from("workout_logs")
      .select("started_at")
      .eq("id", workoutLogId)
      .eq("client_id", clientId)
      .single();

    const now = new Date();
    let durationMinutes: number | null = null;
    if (wl?.started_at) {
      durationMinutes = Math.round((now.getTime() - new Date(wl.started_at).getTime()) / 60000);
    }

    const updateData: Record<string, unknown> = {
      completed: true,
      completed_at: now.toISOString(),
      duration_minutes: durationMinutes,
    };
    if (notes !== undefined) updateData.notes = notes || null;
    // Allow user to backdate the workout (default: keep original date)
    if (customDate) {
      updateData.date = customDate;
    }
    const { error } = await supabase
      .from("workout_logs")
      .update(updateData)
      .eq("id", workoutLogId)
      .eq("client_id", clientId);
    if (error) throw error;
  },

  async logExercise(
    workoutLogId: string,
    routineExerciseId: string,
    data: { sets_completed: number; weight_used?: number; reps_completed?: string; feedback?: string }
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

    // Respaldado por uq_exercise_logs_workout_exercise (migración 00037).
    // El fallback a insert que había aquí creaba un duplicado en cada guardado
    // porque la constraint del onConflict no existía y el upsert fallaba siempre.
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
    if (error) throw error;
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

  async addMyMeasurement(input: Omit<BodyMeasurement, "id" | "created_at" | "client_id">) {
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
    if (!client) throw new Error("Client not found");

    const { data, error } = await supabase
      .from("body_measurements")
      .insert({ ...input, client_id: client.id })
      .select()
      .single();
    if (error) throw error;
    return data as BodyMeasurement;
  },

  async getMyActiveMealPlan(): Promise<MealPlan | null> {
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

    // Get active meal plan assignment
    const { data: assignment, error: assignError } = await supabase
      .from("client_meal_plans")
      .select("*")
      .eq("client_id", client.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (assignError) throw assignError;
    if (!assignment) return null;

    // Fetch the meal plan
    const { data: mealPlan, error: planError } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("id", assignment.meal_plan_id)
      .single();
    if (planError) throw planError;
    if (!mealPlan) return null;

    // Fetch meals
    const { data: meals, error: mealsError } = await supabase
      .from("meal_plan_meals")
      .select("*")
      .eq("meal_plan_id", mealPlan.id)
      .order("order_index", { ascending: true });
    if (mealsError) throw mealsError;

    // Fetch foods for all meals
    const mealIds = (meals ?? []).map((m) => m.id);
    let foods: MealFood[] = [];

    if (mealIds.length > 0) {
      const { data: foodData, error: foodError } = await supabase
        .from("meal_foods")
        .select("*")
        .in("meal_plan_meal_id", mealIds)
        .order("order_index", { ascending: true });
      if (foodError) throw foodError;
      foods = (foodData ?? []) as MealFood[];
    }

    // Assemble
    const assembledMeals: MealPlanMeal[] = (meals ?? []).map((meal) => ({
      ...meal,
      foods: foods.filter((f) => f.meal_plan_meal_id === meal.id),
    }));

    return { ...mealPlan, meals: assembledMeals } as MealPlan;
  },

  async getProgressData(clientRoutineId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: workouts, error } = await supabase
      .from("workout_logs")
      .select("*, exercise_logs:exercise_logs(*, routine_exercise:routine_exercises(*, exercise:exercises(name, name_es)))")
      .eq("client_routine_id", clientRoutineId)
      .eq("client_id", clientId)
      .eq("completed", true)
      .order("date", { ascending: true });

    if (error) throw error;
    return workouts as WorkoutWithExercises[];
  },

  async getMyQuestionnaires() {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data, error } = await supabase
      .from("client_questionnaires")
      .select("*, template:questionnaire_templates(id, name, description, category)")
      .eq("client_id", clientId)
      .order("assigned_at", { ascending: false });
    if (error) throw error;
    return data as ClientQuestionnaire[];
  },

  async getMyQuestionnaireDetail(clientQuestionnaireId: string) {
    const { supabase, clientId } = await getAuthenticatedClient();

    // Get client questionnaire (verify ownership)
    const { data: clientQ, error: cqError } = await supabase
      .from("client_questionnaires")
      .select("*, template:questionnaire_templates(*)")
      .eq("id", clientQuestionnaireId)
      .eq("client_id", clientId)
      .single();
    if (cqError) throw cqError;

    // Get questions for the template
    const { data: questions, error: questionsError } = await supabase
      .from("questionnaire_questions")
      .select("*")
      .eq("template_id", clientQ.template_id)
      .order("order_index", { ascending: true });
    if (questionsError) throw questionsError;

    // Get existing responses
    const { data: responses, error: responsesError } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .eq("client_questionnaire_id", clientQuestionnaireId);
    if (responsesError) throw responsesError;

    return {
      ...clientQ,
      template: {
        ...clientQ.template,
        questions: (questions ?? []) as QuestionnaireQuestion[],
      },
      responses: (responses ?? []) as QuestionnaireResponse[],
    } as ClientQuestionnaire;
  },

  async submitQuestionnaireResponses(
    clientQuestionnaireId: string,
    responses: {
      question_id: string;
      answer_text?: string | null;
      answer_number?: number | null;
      answer_boolean?: boolean | null;
      answer_date?: string | null;
      answer_json?: Record<string, unknown> | null;
    }[]
  ) {
    const { supabase, clientId } = await getAuthenticatedClient();

    // Verify ownership
    const { data: clientQ, error: cqError } = await supabase
      .from("client_questionnaires")
      .select("id")
      .eq("id", clientQuestionnaireId)
      .eq("client_id", clientId)
      .single();
    if (cqError || !clientQ) throw new Error("Not authorized");

    // Upsert responses
    const responsesToUpsert = responses.map((r) => ({
      client_questionnaire_id: clientQuestionnaireId,
      question_id: r.question_id,
      answer_text: r.answer_text ?? null,
      answer_number: r.answer_number ?? null,
      answer_boolean: r.answer_boolean ?? null,
      answer_date: r.answer_date ?? null,
      answer_json: r.answer_json ?? null,
    }));

    const { error: upsertError } = await supabase
      .from("questionnaire_responses")
      .upsert(responsesToUpsert, {
        onConflict: "client_questionnaire_id,question_id",
        ignoreDuplicates: false,
      });
    if (upsertError) throw upsertError;

    // Update status to completed
    const { error: updateError } = await supabase
      .from("client_questionnaires")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", clientQuestionnaireId)
      .eq("client_id", clientId);
    if (updateError) throw updateError;
  },

  async getMyActiveCoachingPlan() {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data, error } = await supabase
      .from("client_coaching_plans")
      .select("*, coaching_plan:coaching_plans(*, service_tier:service_tiers(id, name, color, features))")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getMyActiveServiceTier() {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data, error } = await supabase
      .from("client_service_tiers")
      .select("*, service_tier:service_tiers(*)")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as ClientServiceTier | null;
  },
};

export interface WorkoutWithExercises extends WorkoutLog {
  exercise_logs: (ExerciseLog & {
    routine_exercise: {
      id: string;
      exercise: { name: string; name_es: string | null } | null;
    } | null;
  })[];
}
