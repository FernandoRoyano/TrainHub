import { createClient } from "@/lib/supabase/client";

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

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const mondayISO = getMonday();

    const [
      clientsResult,
      routinesResult,
      conversationsResult,
      recentClientsResult,
      recentRoutinesResult,
      recentAssignmentsResult,
      _pendingClientsResult,
      weekWorkoutsResult,
      pendingReviewsResult,
      newClientsWeekResult,
      // Analytics queries
      activeClientsListResult,
      activeClientRoutinesResult,
      allRecentLogsResult,
    ] = await Promise.all([
      // Active clients count
      supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", user.id)
        .eq("status", "active"),
      // Total routines count
      supabase
        .from("routines")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", user.id),
      // Conversations (for unread messages)
      supabase
        .from("conversations")
        .select("id")
        .eq("trainer_id", user.id),
      // Recent clients
      supabase
        .from("clients")
        .select("id, full_name, created_at")
        .eq("trainer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      // Recent routines
      supabase
        .from("routines")
        .select("id, name, created_at")
        .eq("trainer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      // Recent assignments
      supabase
        .from("client_routines")
        .select("id, created_at, client:clients(full_name), routine:routines(name)")
        .order("created_at", { ascending: false })
        .limit(5),
      // Pending clients count
      supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", user.id)
        .eq("status", "pending"),
      // Week workout logs (all clients of this trainer) - include date for chart
      supabase
        .from("workout_logs")
        .select("id, client_id, date, client_routine:client_routines!inner(trainer_id)")
        .eq("client_routine.trainer_id" as string, user.id)
        .gte("date", mondayISO),
      // Pending reviews: active routines assigned > 28 days ago
      supabase
        .from("client_routines")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", user.id)
        .eq("status", "active")
        .lt("start_date", new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0]),
      // New clients this week
      supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", user.id)
        .gte("created_at", mondayISO),
      // Active clients with names (for compliance table)
      supabase
        .from("clients")
        .select("id, full_name")
        .eq("trainer_id", user.id)
        .eq("status", "active"),
      // Active client_routines with days_per_week
      supabase
        .from("client_routines")
        .select("client_id, routine:routines(days_per_week)")
        .eq("trainer_id", user.id)
        .eq("status", "active"),
      // All recent workout logs (last 90 days) for last workout dates
      supabase
        .from("workout_logs")
        .select("client_id, date, client_routine:client_routines!inner(trainer_id)")
        .eq("client_routine.trainer_id" as string, user.id)
        .gte("date", new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0])
        .order("date", { ascending: false }),
    ]);

    const activeClients = clientsResult.count ?? 0;
    const totalRoutines = routinesResult.count ?? 0;
    const pendingReviews = pendingReviewsResult.count ?? 0;
    const newClientsWeek = newClientsWeekResult.count ?? 0;

    // Unread messages
    let unreadMessages = 0;
    let messagesSentWeek = 0;
    const conversations = conversationsResult.data;
    if (conversations && conversations.length > 0) {
      const convIds = conversations.map((c) => c.id);
      const [unreadResult, sentResult] = await Promise.all([
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", convIds)
          .eq("read", false)
          .neq("sender_id", user.id),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", convIds)
          .eq("sender_id", user.id)
          .gte("created_at", mondayISO),
      ]);
      unreadMessages = unreadResult.count ?? 0;
      messagesSentWeek = sentResult.count ?? 0;
    }

    // Week workouts & tracking rate
    const weekWorkouts = weekWorkoutsResult.data ?? [];
    const weekSessions = weekWorkouts.length;
    const uniqueClientsThisWeek = new Set(weekWorkouts.map((w) => w.client_id)).size;
    const trackingRate = activeClients > 0
      ? Math.round((uniqueClientsThisWeek / activeClients) * 100)
      : 0;

    // Build activity list
    const activity: ActivityItem[] = [];

    if (recentClientsResult.data) {
      for (const client of recentClientsResult.data) {
        activity.push({
          id: `client-${client.id}`,
          type: "client_added",
          description: client.full_name,
          timestamp: client.created_at,
        });
      }
    }

    if (recentRoutinesResult.data) {
      for (const routine of recentRoutinesResult.data) {
        activity.push({
          id: `routine-${routine.id}`,
          type: "routine_created",
          description: routine.name,
          timestamp: routine.created_at,
        });
      }
    }

    if (recentAssignmentsResult.data) {
      for (const assign of recentAssignmentsResult.data) {
        const client = assign.client as unknown as { full_name: string } | null;
        const routine = assign.routine as unknown as { name: string } | null;
        activity.push({
          id: `assign-${assign.id}`,
          type: "routine_assigned",
          description: `${routine?.name ?? "Routine"} → ${client?.full_name ?? "Client"}`,
          timestamp: assign.created_at,
        });
      }
    }

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // --- Analytics: Weekly Activity Chart ---
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayCounts: Record<string, number> = {};
    for (const name of dayNames) dayCounts[name] = 0;

    for (const log of weekWorkouts) {
      const d = new Date(log.date);
      const jsDay = d.getDay(); // 0=Sun
      const idx = jsDay === 0 ? 6 : jsDay - 1; // Convert to 0=Mon
      dayCounts[dayNames[idx]]++;
    }

    const weeklyActivity: DailyActivity[] = dayNames.map((day) => ({
      day,
      workouts: dayCounts[day],
    }));

    // --- Analytics: Client Compliance ---
    const activeClientsList = activeClientsListResult.data ?? [];

    // Map client_id -> assigned days per week
    const daysPerWeekMap: Record<string, number> = {};
    for (const cr of activeClientRoutinesResult.data ?? []) {
      const dpw = (cr.routine as unknown as { days_per_week: number } | null)?.days_per_week ?? 0;
      const cid = cr.client_id as string;
      daysPerWeekMap[cid] = Math.max(daysPerWeekMap[cid] ?? 0, dpw);
    }

    // Map client_id -> workouts this week (from weekWorkouts already loaded)
    const weekWorkoutsPerClient: Record<string, number> = {};
    for (const log of weekWorkouts) {
      const cid = log.client_id as string;
      weekWorkoutsPerClient[cid] = (weekWorkoutsPerClient[cid] ?? 0) + 1;
    }

    // Map client_id -> last workout date (from allRecentLogs)
    const lastWorkoutMap: Record<string, string> = {};
    for (const log of allRecentLogsResult.data ?? []) {
      const cid = log.client_id as string;
      if (!lastWorkoutMap[cid]) lastWorkoutMap[cid] = log.date;
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
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { unreadMessages: 0, pendingClients: 0 };

    const [conversationsResult, pendingResult] = await Promise.all([
      supabase
        .from("conversations")
        .select("id")
        .eq("trainer_id", user.id),
      supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", user.id)
        .eq("status", "pending"),
    ]);

    let unreadMessages = 0;
    const conversations = conversationsResult.data;
    if (conversations && conversations.length > 0) {
      const convIds = conversations.map((c) => c.id);
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", convIds)
        .eq("read", false)
        .neq("sender_id", user.id);
      unreadMessages = count ?? 0;
    }

    return {
      unreadMessages,
      pendingClients: pendingResult.count ?? 0,
    };
  },
};
