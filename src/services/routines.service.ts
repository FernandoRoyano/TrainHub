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
  final_notes: string | null;
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

// Rutina completa (días + grupos + ejercicios) con queries planas batched.
// Compartido con client-app.service (getMyActiveRoutine).
// NOTA: NO usar un embed anidado de PostgREST aquí — el load test de jul-2026
// mostró que la query única con json_agg + RLS en 4 tablas se desploma bajo
// concurrencia (statement timeout con 10 usuarios a la vez), mientras que
// estas queries planas con .in() aguantan sin errores.
export async function fetchRoutineDetail(
  supabase: ReturnType<typeof createClient>,
  routineId: string
): Promise<Routine> {
  // Routine + days en paralelo
  const [routineResult, daysResult] = await Promise.all([
    supabase.from("routines").select("*").eq("id", routineId).single(),
    supabase
      .from("routine_days")
      .select("*")
      .eq("routine_id", routineId)
      .order("day_number", { ascending: true }),
  ]);
  if (routineResult.error) throw routineResult.error;
  if (daysResult.error) throw daysResult.error;
  const routine = routineResult.data;
  const days = daysResult.data ?? [];

  const dayIds = days.map((d) => d.id);
  let exercises: RoutineExercise[] = [];
  let groups: ExerciseGroup[] = [];
  if (dayIds.length > 0) {
    const [exResult, groupResult] = await Promise.all([
      supabase
        .from("routine_exercises")
        .select("*, exercise:exercises(*)")
        .in("routine_day_id", dayIds)
        .order("order_index", { ascending: true }),
      supabase
        .from("exercise_groups")
        .select("*")
        .in("routine_day_id", dayIds)
        .order("order_index", { ascending: true }),
    ]);
    if (exResult.error) throw exResult.error;
    exercises = (exResult.data ?? []) as RoutineExercise[];
    groups = (groupResult.data ?? []) as ExerciseGroup[];
  }

  const assembledDays: RoutineDay[] = days.map((day) => {
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

  return { ...routine, days: assembledDays } as Routine;
}

// Mapea un día (con sus grupos) a datos de formulario para copiarlo. Antes
// duplicar/usar-plantilla solo copiaba la lista plana de ejercicios: las
// biseries/circuitos/EMOM/AMRAP se aplanaban y la descripción del día se perdía.
function mapDayForCopy(day: RoutineDay) {
  const mapExercise = (ex: RoutineExercise) => ({
    exercise_id: ex.exercise_id,
    order_index: ex.order_index,
    sets: ex.sets,
    reps: ex.reps,
    rest_seconds: ex.rest_seconds,
    notes: ex.notes ?? "",
    superset_group: ex.superset_group,
  });
  return {
    day_number: day.day_number,
    name: day.name ?? "",
    notes: day.notes ?? "",
    description: day.description ?? "",
    groups: (day.groups ?? []).map((g) => ({
      group_type: g.group_type,
      order_index: g.order_index,
      rounds: g.rounds,
      time_limit_seconds: g.time_limit_seconds,
      rest_between_rounds: g.rest_between_rounds,
      label: g.label ?? "",
      notes: g.notes ?? "",
      exercises: g.exercises.map(mapExercise),
    })),
    exercises: day.exercises.map(mapExercise),
  };
}

// Persiste días + grupos + ejercicios de una rutina en 3 queries batched
// (antes: bucle con 2 inserts POR GRUPO → ~48 round-trips en una rutina 4×6).
// Compartido por createRoutine y updateRoutine.
async function insertDaysGroupsExercises(
  supabase: ReturnType<typeof createClient>,
  routineId: string,
  days: RoutineFormData["days"]
): Promise<void> {
  if (days.length === 0) return;

  // 1. Días (batched, ya era así)
  const daysToInsert = days.map((day) => ({
    routine_id: routineId,
    day_number: day.day_number,
    name: day.name || null,
    notes: day.notes || null,
    description: day.description || null,
  }));
  const { data: insertedDays, error: daysError } = await supabase
    .from("routine_days")
    .insert(daysToInsert)
    .select("id, day_number");
  if (daysError) throw daysError;
  const dayIdByNumber = new Map<number, string>(
    (insertedDays ?? []).map((d) => [d.day_number as number, d.id as string])
  );

  // 2. TODOS los grupos de todos los días en un solo insert.
  // Guard: order_index debe ser único por día (el store reindexa 0..n-1,
  // pero se reindexa aquí por si llega un payload externo inconsistente).
  const allGroups: {
    routine_day_id: string;
    group_type: string;
    order_index: number;
    rounds: number | null;
    time_limit_seconds: number | null;
    rest_between_rounds: number | null;
    label: string | null;
    notes: string | null;
  }[] = [];
  for (const day of days) {
    const dayId = dayIdByNumber.get(day.day_number);
    if (!dayId || !day.groups || day.groups.length === 0) continue;
    day.groups.forEach((group, idx) => {
      allGroups.push({
        routine_day_id: dayId,
        group_type: group.group_type,
        order_index: idx,
        rounds: group.rounds ?? null,
        time_limit_seconds: group.time_limit_seconds ?? null,
        rest_between_rounds: group.rest_between_rounds ?? null,
        label: group.label || null,
        notes: group.notes || null,
      });
    });
  }

  // El id de cada grupo se resuelve por clave (routine_day_id, order_index):
  // el orden del array devuelto por un insert batch NO está garantizado.
  const groupIdByKey = new Map<string, string>();
  if (allGroups.length > 0) {
    const { data: insertedGroups, error: groupsError } = await supabase
      .from("exercise_groups")
      .insert(allGroups)
      .select("id, routine_day_id, order_index");
    if (groupsError) throw groupsError;
    for (const g of insertedGroups ?? []) {
      groupIdByKey.set(`${g.routine_day_id}:${g.order_index}`, g.id as string);
    }
  }

  // 3. TODOS los ejercicios en un solo insert
  const allExercises: {
    routine_day_id: string;
    exercise_group_id: string | null;
    exercise_id: string;
    order_index: number;
    sets: number;
    reps: string;
    rest_seconds: number;
    notes: string | null;
    superset_group: number | null;
  }[] = [];
  for (const day of days) {
    const dayId = dayIdByNumber.get(day.day_number);
    if (!dayId) continue;

    if (day.groups && day.groups.length > 0) {
      day.groups.forEach((group, idx) => {
        const groupId = groupIdByKey.get(`${dayId}:${idx}`) ?? null;
        for (const ex of group.exercises) {
          allExercises.push({
            routine_day_id: dayId,
            exercise_group_id: groupId,
            exercise_id: ex.exercise_id,
            order_index: ex.order_index,
            sets: ex.sets,
            reps: ex.reps,
            rest_seconds: ex.rest_seconds,
            notes: ex.notes || null,
            superset_group: ex.superset_group ?? null,
          });
        }
      });
    } else {
      // Ruta plana retrocompat: la lectura envuelve estos ejercicios en
      // solo-groups sintéticos (fetchRoutineDetail)
      for (const ex of day.exercises) {
        allExercises.push({
          routine_day_id: dayId,
          exercise_group_id: null,
          exercise_id: ex.exercise_id,
          order_index: ex.order_index,
          sets: ex.sets,
          reps: ex.reps,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes || null,
          superset_group: ex.superset_group ?? null,
        });
      }
    }
  }

  if (allExercises.length > 0) {
    const { error: exError } = await supabase
      .from("routine_exercises")
      .insert(allExercises);
    if (exError) throw exError;
  }
}

export const routinesService = {
  async getRoutines(filters?: RoutineFilters) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
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
    return fetchRoutineDetail(supabase, id);
  },

  async createRoutine(data: RoutineFormData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // 1. Create routine
    const { data: routine, error: routineError } = await supabase
      .from("routines")
      .insert({
        trainer_id: user.id,
        name: data.name,
        description: data.description || null,
        final_notes: data.final_notes || null,
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

    // 2-3. Días + grupos + ejercicios en 3 queries batched
    await insertDaysGroupsExercises(supabase, routine.id, data.days);

    return routine as Routine;
  },

  async updateRoutine(id: string, data: RoutineFormData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // 1. Update routine metadata
    const { error: routineError } = await supabase
      .from("routines")
      .update({
        name: data.name,
        description: data.description || null,
        final_notes: data.final_notes || null,
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

    // 2. Delete existing days (cascades to exercises).
    // Delete-and-reinsert deliberado: si falla a mitad la rutina queda sin
    // días (riesgo preexistente); el batching reduce la ventana de ~48 pasos a ~3.
    const { error: deleteError } = await supabase
      .from("routine_days")
      .delete()
      .eq("routine_id", id);
    if (deleteError) throw deleteError;

    // 3. Re-create days, groups and exercises (3 queries batched)
    await insertDaysGroupsExercises(supabase, id, data.days);
  },

  async deleteRoutine(id: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
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
      final_notes: routine.final_notes ?? "",
      duration_weeks: routine.duration_weeks,
      days_per_week: routine.days_per_week,
      difficulty: routine.difficulty as RoutineFormData["difficulty"],
      target_gender: routine.target_gender as RoutineFormData["target_gender"],
      is_template: routine.is_template,
      cover_image: routine.cover_image ?? "",
      days: (routine.days ?? []).map(mapDayForCopy),
    };
    return this.createRoutine(formData);
  },

  async useTemplate(id: string, newName: string) {
    const routine = await this.getRoutineById(id);
    const formData: RoutineFormData = {
      name: newName,
      description: routine.description ?? "",
      final_notes: routine.final_notes ?? "",
      duration_weeks: routine.duration_weeks,
      days_per_week: routine.days_per_week,
      difficulty: routine.difficulty as RoutineFormData["difficulty"],
      target_gender: routine.target_gender as RoutineFormData["target_gender"],
      is_template: false,
      cover_image: routine.cover_image ?? "",
      days: (routine.days ?? []).map(mapDayForCopy),
    };
    return this.createRoutine(formData);
  },

  async assignToClient(data: AssignRoutineData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
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
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
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
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
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
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("client_routines")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },
};
