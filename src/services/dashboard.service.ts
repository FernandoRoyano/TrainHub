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

    // Active clients count
    const { count: activeClients } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("trainer_id", user.id)
      .eq("status", "active");

    // Total routines count
    const { count: totalRoutines } = await supabase
      .from("routines")
      .select("*", { count: "exact", head: true })
      .eq("trainer_id", user.id);

    // Unread messages count
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .eq("trainer_id", user.id);

    let unreadMessages = 0;
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

    // Recent activity (last 10 items)
    const activity: ActivityItem[] = [];

    // Recent clients
    const { data: recentClients } = await supabase
      .from("clients")
      .select("id, full_name, created_at")
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentClients) {
      for (const client of recentClients) {
        activity.push({
          id: `client-${client.id}`,
          type: "client_added",
          description: client.full_name,
          timestamp: client.created_at,
        });
      }
    }

    // Recent routines
    const { data: recentRoutines } = await supabase
      .from("routines")
      .select("id, name, created_at")
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentRoutines) {
      for (const routine of recentRoutines) {
        activity.push({
          id: `routine-${routine.id}`,
          type: "routine_created",
          description: routine.name,
          timestamp: routine.created_at,
        });
      }
    }

    // Recent assignments
    const { data: recentAssignments } = await supabase
      .from("client_routines")
      .select("id, created_at, client:clients(full_name), routine:routines(name)")
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentAssignments) {
      for (const assign of recentAssignments) {
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

    // Sort by timestamp descending, take top 10
    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      activeClients: activeClients ?? 0,
      totalRoutines: totalRoutines ?? 0,
      unreadMessages,
      recentActivity: activity.slice(0, 10),
    };
  },
};
