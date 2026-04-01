import { createClient } from "@/lib/supabase/client";

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";
export type FlowLevel = "none" | "light" | "medium" | "heavy" | "spotting";
export type MoodLevel = "great" | "good" | "neutral" | "low" | "bad";

export interface MenstrualLog {
  id: string;
  client_id: string;
  date: string;
  cycle_day: number | null;
  phase: CyclePhase | null;
  flow: FlowLevel | null;
  symptoms: string[];
  mood: MoodLevel | null;
  energy_level: number | null;
  notes: string | null;
  created_at: string;
}

export interface MenstrualSettings {
  id: string;
  client_id: string;
  average_cycle_length: number;
  average_period_length: number;
  last_period_start: string | null;
  tracking_enabled: boolean;
}

export interface CycleInfo {
  currentPhase: CyclePhase;
  cycleDay: number;
  daysUntilNextPeriod: number;
  nextPeriodDate: string;
}

export interface PeriodPrediction {
  startDate: string;
  endDate: string;
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

function calculatePhase(
  cycleDay: number,
  cycleLength: number,
  periodLength: number
): CyclePhase {
  if (cycleDay <= periodLength) return "menstrual";
  if (cycleDay <= cycleLength * 0.5) return "follicular";
  if (cycleDay <= cycleLength * 0.5 + 2) return "ovulation";
  return "luteal";
}

export const menstrualService = {
  async getMenstrualSettings(): Promise<MenstrualSettings> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data } = await supabase
      .from("menstrual_settings")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (data) return data as MenstrualSettings;

    const { data: created, error } = await supabase
      .from("menstrual_settings")
      .insert({
        client_id: clientId,
        average_cycle_length: 28,
        average_period_length: 5,
        tracking_enabled: true,
      })
      .select()
      .single();

    if (error) throw error;
    return created as MenstrualSettings;
  },

  async updateMenstrualSettings(
    data: Partial<Pick<MenstrualSettings, "average_cycle_length" | "average_period_length" | "last_period_start" | "tracking_enabled">>
  ): Promise<MenstrualSettings> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: updated, error } = await supabase
      .from("menstrual_settings")
      .update(data)
      .eq("client_id", clientId)
      .select()
      .single();

    if (error) throw error;
    return updated as MenstrualSettings;
  },

  async logDay(
    date: string,
    data: {
      flow?: FlowLevel;
      symptoms?: string[];
      mood?: MoodLevel;
      energy_level?: number;
      notes?: string;
      cycle_day?: number;
      phase?: CyclePhase;
    }
  ): Promise<MenstrualLog> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: existing } = await supabase
      .from("menstrual_logs")
      .select("id")
      .eq("client_id", clientId)
      .eq("date", date)
      .maybeSingle();

    if (existing) {
      const { data: updated, error } = await supabase
        .from("menstrual_logs")
        .update(data)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return updated as MenstrualLog;
    }

    const { data: created, error } = await supabase
      .from("menstrual_logs")
      .insert({
        client_id: clientId,
        date,
        ...data,
      })
      .select()
      .single();

    if (error) throw error;
    return created as MenstrualLog;
  },

  async getDayLog(date: string): Promise<MenstrualLog | null> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data } = await supabase
      .from("menstrual_logs")
      .select("*")
      .eq("client_id", clientId)
      .eq("date", date)
      .maybeSingle();

    return (data as MenstrualLog) ?? null;
  },

  async getMonthLogs(year: number, month: number): Promise<MenstrualLog[]> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("menstrual_logs")
      .select("*")
      .eq("client_id", clientId)
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: true });

    if (error) throw error;
    return (data ?? []) as MenstrualLog[];
  },

  async getCycleInfo(): Promise<CycleInfo | null> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: settings } = await supabase
      .from("menstrual_settings")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (!settings?.last_period_start) return null;

    const lastStart = new Date(settings.last_period_start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - lastStart.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const cycleLength = settings.average_cycle_length || 28;
    const periodLength = settings.average_period_length || 5;

    const cycleDay = (diffDays % cycleLength) + 1;
    const daysUntilNextPeriod = cycleLength - cycleDay + 1;
    const nextPeriodDate = new Date(today);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + daysUntilNextPeriod);

    const currentPhase = calculatePhase(cycleDay, cycleLength, periodLength);

    return {
      currentPhase,
      cycleDay,
      daysUntilNextPeriod,
      nextPeriodDate: nextPeriodDate.toISOString().split("T")[0],
    };
  },

  async getPredictions(): Promise<PeriodPrediction[]> {
    const { supabase, clientId } = await getAuthenticatedClient();

    const { data: settings } = await supabase
      .from("menstrual_settings")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (!settings?.last_period_start) return [];

    const lastStart = new Date(settings.last_period_start);
    const cycleLength = settings.average_cycle_length || 28;
    const periodLength = settings.average_period_length || 5;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the next upcoming period start
    const diffDays = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));
    const cyclesPassed = Math.ceil(diffDays / cycleLength);

    const predictions: PeriodPrediction[] = [];
    for (let i = 0; i < 3; i++) {
      const startDate = new Date(lastStart);
      startDate.setDate(startDate.getDate() + (cyclesPassed + i) * cycleLength);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + periodLength - 1);

      predictions.push({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    }

    return predictions;
  },
};
