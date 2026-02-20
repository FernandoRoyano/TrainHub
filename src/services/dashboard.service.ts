import { createClient } from "@/lib/supabase/client";

export interface DashboardStats {
  activeClients: number;
  totalRoutines: number;
  unreadMessages: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "client_added" | "routine_created" | "routine_assigned" | "message_received";
  description: string;
  timestamp: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Run ALL queries in parallel instead of sequentially
    const [
      clientsResult,
      routinesResult,
      conversationsResult,
      recentClientsResult,
      recentRoutinesResult,
      recentAssignmentsResult,
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
    ]);

    const activeClients = clientsResult.count ?? 0;
    const totalRoutines = routinesResult.count ?? 0;

    // Unread messages — single dependent query only if conversations exist
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

    // Build activity list from parallel results
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
      activeClients: activeClients ?? 0,
      totalRoutines: totalRoutines ?? 0,
      unreadMessages,
      recentActivity: activity.slice(0, 10),
    };
  },
};
