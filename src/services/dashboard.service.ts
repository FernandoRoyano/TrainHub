import { createClient } from "@/lib/supabase/client";

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
      // New queries
      _pendingClientsResult,
      weekWorkoutsResult,
      pendingReviewsResult,
      newClientsWeekResult,
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
      // Week workout logs (all clients of this trainer)
      supabase
        .from("workout_logs")
        .select("id, client_id, client_routine:client_routines!inner(trainer_id)")
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
