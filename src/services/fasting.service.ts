import { createClient } from "@/lib/supabase/client";

export interface FastingLog {
  id: string;
  client_id: string;
  protocol: string;
  fast_start: string;
  fast_end: string | null;
  target_hours: number;
  actual_hours: number | null;
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface FastingSettings {
  id: string;
  client_id: string;
  default_protocol: string;
  custom_hours: number | null;
  reminder_enabled: boolean;
}

export interface FastingStats {
  totalFasts: number;
  avgHours: number;
  completionRate: number;
  currentStreak: number;
}

async function getAuthenticatedClient() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) throw new Error("Not authenticated");

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!client) throw new Error("No client record found");

  return { supabase, clientId: client.id };
}

export const fastingService = {
  async getFastingSettings(): Promise<FastingSettings> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data } = await supabase
      .from("fasting_settings")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (data) return data as FastingSettings;

    const { data: created, error } = await supabase
      .from("fasting_settings")
      .insert({
        client_id: clientId,
        default_protocol: "16_8",
        reminder_enabled: false,
      })
      .select()
      .single();

    if (error) throw error;
    return created as FastingSettings;
  },

  async updateFastingSettings(
    data: Partial<Pick<FastingSettings, "default_protocol" | "custom_hours" | "reminder_enabled">>
  ): Promise<FastingSettings> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: updated, error } = await supabase
      .from("fasting_settings")
      .update(data)
      .eq("client_id", clientId)
      .select()
      .single();

    if (error) throw error;
    return updated as FastingSettings;
  },

  async startFast(protocol: string, targetHours: number): Promise<FastingLog> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data, error } = await supabase
      .from("fasting_logs")
      .insert({
        client_id: clientId,
        protocol,
        fast_start: new Date().toISOString(),
        target_hours: targetHours,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as FastingLog;
  },

  async endFast(logId: string): Promise<FastingLog> {
    const { supabase } = await getAuthenticatedClient();

    const { data: log } = await supabase
      .from("fasting_logs")
      .select("fast_start, target_hours")
      .eq("id", logId)
      .single();

    if (!log) throw new Error("Fast not found");

    const fastEnd = new Date();
    const fastStart = new Date(log.fast_start);
    const actualHours = (fastEnd.getTime() - fastStart.getTime()) / (1000 * 60 * 60);
    const completed = actualHours >= log.target_hours;

    const { data: updated, error } = await supabase
      .from("fasting_logs")
      .update({
        fast_end: fastEnd.toISOString(),
        actual_hours: Math.round(actualHours * 100) / 100,
        completed,
      })
      .eq("id", logId)
      .select()
      .single();

    if (error) throw error;
    return updated as FastingLog;
  },

  async getActiveFast(): Promise<FastingLog | null> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data } = await supabase
      .from("fasting_logs")
      .select("*")
      .eq("client_id", clientId)
      .is("fast_end", null)
      .order("fast_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (data as FastingLog) ?? null;
  },

  async getFastingHistory(limit = 10): Promise<FastingLog[]> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data, error } = await supabase
      .from("fasting_logs")
      .select("*")
      .eq("client_id", clientId)
      .not("fast_end", "is", null)
      .order("fast_start", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as FastingLog[];
  },

  async getFastingStats(): Promise<FastingStats> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: logs } = await supabase
      .from("fasting_logs")
      .select("actual_hours, completed, fast_start")
      .eq("client_id", clientId)
      .not("fast_end", "is", null)
      .order("fast_start", { ascending: false });

    const all = (logs ?? []) as { actual_hours: number | null; completed: boolean; fast_start: string }[];
    const totalFasts = all.length;
    const completedFasts = all.filter((l) => l.completed);
    const avgHours =
      totalFasts > 0
        ? Math.round((all.reduce((s, l) => s + (l.actual_hours ?? 0), 0) / totalFasts) * 10) / 10
        : 0;
    const completionRate = totalFasts > 0 ? Math.round((completedFasts.length / totalFasts) * 100) : 0;

    // Calculate current streak (consecutive completed fasts)
    let currentStreak = 0;
    for (const log of all) {
      if (log.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { totalFasts, avgHours, completionRate, currentStreak };
  },

  async deleteFast(logId: string): Promise<void> {
    const { supabase, clientId } = await getAuthenticatedClient();
    const { error } = await supabase
      .from("fasting_logs")
      .delete()
      .eq("id", logId)
      .eq("client_id", clientId);
    if (error) throw error;
  },
};
