import { createClient } from "@/lib/supabase/client";

export interface WeeklyCheckin {
  id: string;
  client_id: string;
  week_start: string;
  energy: number;
  sleep_quality: number;
  adherence: number;
  stress: number;
  notes: string | null;
  created_at: string;
}

export type CheckinInput = Omit<WeeklyCheckin, "id" | "client_id" | "created_at">;

function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

export const checkinsService = {
  getWeekStart,

  async getMyCheckins(): Promise<WeeklyCheckin[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) throw new Error("No client record");

    const { data, error } = await supabase
      .from("weekly_checkins")
      .select("*")
      .eq("client_id", client.id)
      .order("week_start", { ascending: false });
    if (error) throw error;
    return data as WeeklyCheckin[];
  },

  async submitCheckin(input: Omit<CheckinInput, "week_start"> & { week_start?: string }): Promise<WeeklyCheckin> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) throw new Error("No client record");

    const week_start = input.week_start ?? getWeekStart();

    const { data, error } = await supabase
      .from("weekly_checkins")
      .upsert(
        { ...input, week_start, client_id: client.id },
        { onConflict: "client_id,week_start" }
      )
      .select()
      .single();
    if (error) throw error;
    return data as WeeklyCheckin;
  },

  async getClientCheckins(clientId: string): Promise<WeeklyCheckin[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("weekly_checkins")
      .select("*")
      .eq("client_id", clientId)
      .order("week_start", { ascending: false })
      .limit(12);
    if (error) throw error;
    return data as WeeklyCheckin[];
  },
};
