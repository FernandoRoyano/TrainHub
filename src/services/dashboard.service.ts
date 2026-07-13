import { createClient } from "@/lib/supabase/client";
import { localWeekStartMonday, parseLocalDate } from "@/lib/local-date";

export interface DailyActivity {
  day: string;
  workouts: number;
}

export interface ClientComplianceRow {
  clientId: string;
  name: string;
  workoutsThisWeek: number;
  assignedDays: number;
  compliancePercent: number;
  lastWorkoutDate: string | null;
}

export interface AtRiskClient {
  clientId: string;
  name: string;
  daysSinceLastWorkout: number;
}

export interface DashboardStats {
  activeClients: number;
  totalRoutines: number;
  unreadMessages: number;
  trackingRate: number;
  pendingReviews: number;
  weekSessions: number;
  weekSummary: {
    workouts: number;
    newClients: number;
    messagesSent: number;
  };
  recentActivity: ActivityItem[];
  weeklyActivity: DailyActivity[];
  clientCompliance: ClientComplianceRow[];
  clientsAtRisk: AtRiskClient[];
}

export interface ActivityItem {
  id: string;
  type: "client_added" | "routine_created" | "routine_assigned" | "message_received";
  description: string;
  timestamp: string;
}

export interface SidebarBadges {
  unreadMessages: number;
  pendingClients: number;
}

function getMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

interface DashboardRpcPayload {
  active_clients: number;
  total_routines: number;
  pending_reviews: number;
  new_clients_week: number;
  unread_messages: number;
  messages_sent_week: number;
  recent_clients: { id: string; full_name: string; created_at: string }[];
  recent_routines: { id: string; name: string; created_at: string }[];
  recent_assignments: {
    id: string;
    created_at: string;
    client_name: string | null;
    routine_name: string | null;
  }[];
  week_workouts: { client_id: string; date: string }[];
  active_clients_list: { id: string; full_name: string }[];
  client_routine_days: { client_id: string; days_per_week: number }[];
  last_workouts: { client_id: string; date: string }[];
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const supabase = createClient();

    const mondayISO = getMonday(); // instante UTC: solo para columnas timestamptz
    // Para columnas DATE hay que comparar con la fecha LOCAL: el lunes 00:00
    // local serializado a ISO cae en domingo en UTC+ y arrastraba el domingo
    // anterior a "esta semana".
    const mondayDate = localWeekStartMonday();

    // Un solo RPC en vez de 15 requests; el ensamblado sigue en JS
    const { data, error } = await supabase.rpc("get_dashboard_stats", {
      p_week_start: mondayDate,
      p_week_start_ts: mondayISO,
    });
    if (error) throw error;
    const stats = data as DashboardRpcPayload;

    const activeClients = stats.active_clients ?? 0;
    const totalRoutines = stats.total_routines ?? 0;
    const pendingReviews = stats.pending_reviews ?? 0;
    const newClientsWeek = stats.new_clients_week ?? 0;
    const unreadMessages = stats.unread_messages ?? 0;
    const messagesSentWeek = stats.messages_sent_week ?? 0;

    // Week workouts & tracking rate
    const weekWorkouts = stats.week_workouts ?? [];
    const weekSessions = weekWorkouts.length;
    const uniqueClientsThisWeek = new Set(weekWorkouts.map((w) => w.client_id)).size;
    const trackingRate = activeClients > 0
      ? Math.round((uniqueClientsThisWeek / activeClients) * 100)
      : 0;

    // Build activity list
    const activity: ActivityItem[] = [];

    for (const client of stats.recent_clients ?? []) {
      activity.push({
        id: `client-${client.id}`,
        type: "client_added",
        description: client.full_name,
        timestamp: client.created_at,
      });
    }

    for (const routine of stats.recent_routines ?? []) {
      activity.push({
        id: `routine-${routine.id}`,
        type: "routine_created",
        description: routine.name,
        timestamp: routine.created_at,
      });
    }

    for (const assign of stats.recent_assignments ?? []) {
      activity.push({
        id: `assign-${assign.id}`,
        type: "routine_assigned",
        description: `${assign.routine_name ?? "Routine"} → ${assign.client_name ?? "Client"}`,
        timestamp: assign.created_at,
      });
    }

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // --- Analytics: Weekly Activity Chart ---
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayCounts: Record<string, number> = {};
    for (const name of dayNames) dayCounts[name] = 0;

    for (const log of weekWorkouts) {
      // log.date es DATE: parsear como local. new Date("YYYY-MM-DD") es UTC
      // y en husos negativos desplazaba cada barra un día a la izquierda.
      const d = parseLocalDate(log.date);
      const jsDay = d.getDay(); // 0=Sun
      const idx = jsDay === 0 ? 6 : jsDay - 1; // Convert to 0=Mon
      dayCounts[dayNames[idx]]++;
    }

    const weeklyActivity: DailyActivity[] = dayNames.map((day) => ({
      day,
      workouts: dayCounts[day],
    }));

    // --- Analytics: Client Compliance ---
    const activeClientsList = stats.active_clients_list ?? [];

    // Map client_id -> assigned days per week
    const daysPerWeekMap: Record<string, number> = {};
    for (const cr of stats.client_routine_days ?? []) {
      daysPerWeekMap[cr.client_id] = Math.max(
        daysPerWeekMap[cr.client_id] ?? 0,
        cr.days_per_week ?? 0
      );
    }

    // Map client_id -> workouts this week (from weekWorkouts already loaded)
    const weekWorkoutsPerClient: Record<string, number> = {};
    for (const log of weekWorkouts) {
      weekWorkoutsPerClient[log.client_id] = (weekWorkoutsPerClient[log.client_id] ?? 0) + 1;
    }

    // Map client_id -> last workout date
    const lastWorkoutMap: Record<string, string> = {};
    for (const log of stats.last_workouts ?? []) {
      lastWorkoutMap[log.client_id] = log.date;
    }

    const clientCompliance: ClientComplianceRow[] = activeClientsList
      .map((client) => {
        const assigned = daysPerWeekMap[client.id] ?? 0;
        const done = weekWorkoutsPerClient[client.id] ?? 0;
        const pct = assigned > 0 ? Math.round((done / assigned) * 100) : done > 0 ? 100 : 0;
        return {
          clientId: client.id,
          name: client.full_name,
          workoutsThisWeek: done,
          assignedDays: assigned,
          compliancePercent: pct,
          lastWorkoutDate: lastWorkoutMap[client.id] ?? null,
        };
      })
      .sort((a, b) => b.compliancePercent - a.compliancePercent);

    // --- Analytics: Clients at Risk (7+ days without workout) ---
    const now = Date.now();
    const clientsAtRisk: AtRiskClient[] = activeClientsList
      .map((client) => {
        const lastDate = lastWorkoutMap[client.id];
        if (!lastDate) return { clientId: client.id, name: client.full_name, daysSinceLastWorkout: -1 };
        const days = Math.floor((now - new Date(lastDate).getTime()) / 86400000);
        return { clientId: client.id, name: client.full_name, daysSinceLastWorkout: days };
      })
      .filter((c) => c.daysSinceLastWorkout === -1 || c.daysSinceLastWorkout >= 7)
      .sort((a, b) => {
        if (a.daysSinceLastWorkout === -1) return -1;
        if (b.daysSinceLastWorkout === -1) return 1;
        return b.daysSinceLastWorkout - a.daysSinceLastWorkout;
      });

    return {
      activeClients,
      totalRoutines,
      unreadMessages,
      trackingRate,
      pendingReviews,
      weekSessions,
      weekSummary: {
        workouts: weekSessions,
        newClients: newClientsWeek,
        messagesSent: messagesSentWeek,
      },
      recentActivity: activity.slice(0, 10),
      weeklyActivity,
      clientCompliance,
      clientsAtRisk,
    };
  },

  async getSidebarBadges(): Promise<SidebarBadges> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return { unreadMessages: 0, pendingClients: 0 };

    // Fuente única de unread/pending (1 RPC en vez de 3 queries)
    const { data, error } = await supabase.rpc("get_sidebar_badges");
    if (error) throw error;
    const badges = data as { unread_messages: number; pending_clients: number };

    return {
      unreadMessages: badges.unread_messages ?? 0,
      pendingClients: badges.pending_clients ?? 0,
    };
  },
};
