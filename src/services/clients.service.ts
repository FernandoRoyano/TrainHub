import { createClient } from "@/lib/supabase/client";
import type { ClientFormData } from "@/lib/validations/client";

export interface ClientActivity {
  lastWorkoutDate: string | null;
  lastConnection: string | null;
  workoutsThisWeek: number;
  assignedDaysPerWeek: number | null;
}

function getMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export interface Client {
  id: string;
  trainer_id: string;
  user_id: string | null;
  email: string | null;
  full_name: string;
  phone: string | null;
  status: string;
  profile_data: Record<string, unknown>;
  gender: "male" | "female" | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface TimelineEvent {
  id: string;
  type: "routine_assigned" | "measurement_taken" | "note_added" | "client_created";
  description: string;
  timestamp: string;
}

export interface ClientWorkoutHistoryItem {
  id: string;
  date: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  routine_day_id: string;
  exercise_logs: {
    id: string;
    sets_completed: number;
    weight_used: number | null;
    reps_completed: string | null;
    routine_exercise: {
      id: string;
      sets: number;
      reps: string | null;
      exercise: { name: string } | null;
    } | null;
  }[];
}

export interface ClientCompliance {
  completedDays: number;
  totalDays: number;
  logs: string[];
}

export const clientsService = {
  async getClients(filters?: ClientFilters) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 20;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("clients")
      .select("*", { count: "exact" })
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as Client[], count: count ?? 0 };
  },

  async getClientById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Client;
  },

  async createClient(data: ClientFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        ...data,
        trainer_id: user.id,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) {
      // Detecta el error del trigger trg_enforce_client_limit (migración 00035)
      // para que la UI pueda mostrar un mensaje específico de límite alcanzado.
      if (error.message?.includes("CLIENT_LIMIT_REACHED")) {
        throw new Error("CLIENT_LIMIT_REACHED");
      }
      throw error;
    }
    return client as Client;
  },

  async updateClient(id: string, data: Partial<ClientFormData>) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("clients")
      .update({
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async deleteClient(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async getClientStats() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("clients")
      .select("status")
      .eq("trainer_id", user.id);
    if (error) throw error;

    const stats = {
      total: data.length,
      active: data.filter((c) => c.status === "active").length,
      inactive: data.filter((c) => c.status === "inactive").length,
      paused: data.filter((c) => c.status === "paused").length,
      pending: data.filter((c) => c.status === "pending").length,
    };
    return stats;
  },

  async getClientsActivity(
    clientIds: string[]
  ): Promise<Record<string, ClientActivity>> {
    if (clientIds.length === 0) return {};

    const supabase = createClient();
    const monday = getMonday();

    // Query workout_logs joined with client_routines to get last workout date
    // and workouts this week per client
    const { data: logs, error: logsError } = await supabase
      .from("workout_logs")
      .select("client_routine_id, completed_at, client_routines!inner(client_id)")
      .in("client_routines.client_id", clientIds)
      .order("completed_at", { ascending: false });

    if (logsError) throw logsError;

    // Get last connection from clients.updated_at (updated on each client app load)
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, updated_at, created_at")
      .in("id", clientIds);

    const connectionMap: Record<string, string | null> = {};
    for (const c of clientsData ?? []) {
      connectionMap[c.id] = c.updated_at || c.created_at;
    }

    // days_per_week vive en `routines`, no en `client_routines` (la query
    // antigua daba 400). Hacemos join para leerlo.
    const { data: routines, error: routinesError } = await supabase
      .from("client_routines")
      .select("client_id, routines(days_per_week)")
      .in("client_id", clientIds)
      .eq("status", "active");

    if (routinesError) throw routinesError;

    const daysPerWeekMap: Record<string, number> = {};
    for (const cr of routines ?? []) {
      const dpw = (cr.routines as unknown as { days_per_week: number } | null)?.days_per_week ?? 0;
      const clientId = cr.client_id as string;
      daysPerWeekMap[clientId] = Math.max(daysPerWeekMap[clientId] ?? 0, dpw);
    }

    // Build activity data from logs
    const activityMap: Record<string, ClientActivity> = {};

    // Initialize all clients
    for (const id of clientIds) {
      activityMap[id] = {
        lastWorkoutDate: null,
        lastConnection: connectionMap[id] ?? null,
        workoutsThisWeek: 0,
        assignedDaysPerWeek: daysPerWeekMap[id] ?? null,
      };
    }

    // Process logs to extract per-client data
    for (const log of logs ?? []) {
      const clientId = (
        log.client_routines as unknown as { client_id: string }
      ).client_id;

      if (!activityMap[clientId]) continue;

      // Track last workout date (logs are ordered descending, first one is latest)
      if (!activityMap[clientId].lastWorkoutDate) {
        activityMap[clientId].lastWorkoutDate = log.completed_at;
      }

      // Count workouts this week
      if (log.completed_at && log.completed_at >= monday) {
        activityMap[clientId].workoutsThisWeek += 1;
      }
    }

    return activityMap;
  },

  async getClientTimeline(clientId: string): Promise<TimelineEvent[]> {
    const supabase = createClient();

    const [routinesRes, measurementsRes, notesRes, clientRes] =
      await Promise.all([
        supabase
          .from("client_routines")
          .select("id, created_at, routine:routines(name)")
          .eq("client_id", clientId),
        supabase
          .from("body_measurements")
          .select("id, date, created_at")
          .eq("client_id", clientId),
        supabase
          .from("session_notes")
          .select("id, title, created_at")
          .eq("client_id", clientId),
        supabase
          .from("clients")
          .select("created_at")
          .eq("id", clientId)
          .single(),
      ]);

    if (routinesRes.error) throw routinesRes.error;
    if (measurementsRes.error) throw measurementsRes.error;
    if (notesRes.error) throw notesRes.error;
    if (clientRes.error) throw clientRes.error;

    const timeline: TimelineEvent[] = [];

    for (const r of routinesRes.data ?? []) {
      const routineName =
        (r.routine as unknown as { name: string } | null)?.name ?? "Unknown";
      timeline.push({
        id: r.id,
        type: "routine_assigned",
        description: routineName,
        timestamp: r.created_at,
      });
    }

    for (const m of measurementsRes.data ?? []) {
      timeline.push({
        id: m.id,
        type: "measurement_taken",
        description: "Measurement",
        timestamp: m.created_at ?? m.date,
      });
    }

    for (const n of notesRes.data ?? []) {
      timeline.push({
        id: n.id,
        type: "note_added",
        description: n.title ?? "Note",
        timestamp: n.created_at,
      });
    }

    if (clientRes.data) {
      timeline.push({
        id: clientId,
        type: "client_created",
        description: "Client created",
        timestamp: clientRes.data.created_at,
      });
    }

    timeline.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return timeline.slice(0, 10);
  },

  async getClientWorkoutHistory(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Verify trainer owns this client
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("trainer_id", user.id)
      .single();
    if (!client) throw new Error("Not authorized");

    const { data, error } = await supabase
      .from("workout_logs")
      .select(
        "id, date, completed, completed_at, notes, routine_day_id, exercise_logs:exercise_logs(id, sets_completed, weight_used, reps_completed, routine_exercise:routine_exercises(id, sets, reps, exercise:exercises(name)))"
      )
      .eq("client_id", clientId)
      .order("date", { ascending: false })
      .limit(30);

    if (error) throw error;
    return data as unknown as ClientWorkoutHistoryItem[];
  },

  async getClientCompliance(clientId: string): Promise<ClientCompliance> {
    const supabase = createClient();

    // Get latest client_routine (active preferred, otherwise most recent)
    // to know days_per_week; we still show logs even if no active routine.
    const { data: clientRoutine } = await supabase
      .from("client_routines")
      .select("id, routine_id, status, routines(days_per_week)")
      .eq("client_id", clientId)
      .order("status", { ascending: true }) // "active" < "completed" alphabetically
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const daysPerWeek =
      (clientRoutine?.routines as unknown as { days_per_week: number } | null)
        ?.days_per_week ?? 0;

    // Get first day of current month as YYYY-MM-DD (local)
    const now = new Date();
    const year = now.getFullYear();
    const monthIdx = now.getMonth();
    const monthStart = `${year}-${String(monthIdx + 1).padStart(2, "0")}-01`;
    const mondayDate = new Date(now);
    const day = mondayDate.getDay();
    const diff = mondayDate.getDate() - day + (day === 0 ? -6 : 1);
    mondayDate.setDate(diff);
    const mondayStr = `${mondayDate.getFullYear()}-${String(mondayDate.getMonth() + 1).padStart(2, "0")}-${String(mondayDate.getDate()).padStart(2, "0")}`;

    // Fetch workout_logs by client_id so paused/reassigned clients still show data
    const { data: monthLogs, error: monthError } = await supabase
      .from("workout_logs")
      .select("date")
      .eq("client_id", clientId)
      .eq("completed", true)
      .gte("date", monthStart);

    if (monthError) throw monthError;

    // Return raw YYYY-MM-DD strings — avoids all timezone pitfalls
    const logDates: string[] = (monthLogs ?? [])
      .map((l) => l.date as string)
      .filter((d): d is string => !!d);

    const weekLogs = logDates.filter((d) => d >= mondayStr);

    return {
      completedDays: weekLogs.length,
      totalDays: daysPerWeek,
      logs: logDates,
    };
  },
};
