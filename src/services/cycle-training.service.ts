import { createClient } from "@/lib/supabase/client";
import type { CyclePhase } from "@/services/menstrual.service";
import { parseLocalDate, daysBetweenLocal, localDateString } from "@/lib/local-date";

export interface CycleTrainingConfig {
  id: string;
  client_id: string;
  trainer_id: string;
  enabled: boolean;
  menstrual_intensity: number;
  menstrual_volume: number;
  menstrual_notes: string | null;
  follicular_intensity: number;
  follicular_volume: number;
  follicular_notes: string | null;
  ovulation_intensity: number;
  ovulation_volume: number;
  ovulation_notes: string | null;
  luteal_intensity: number;
  luteal_volume: number;
  luteal_notes: string | null;
  auto_adjust: boolean;
  created_at: string;
  updated_at: string;
}

export interface CyclePerformanceLog {
  id: string;
  client_id: string;
  workout_log_id: string | null;
  date: string;
  cycle_day: number | null;
  phase: CyclePhase | null;
  perceived_effort: number | null;
  energy_before: number | null;
  energy_after: number | null;
  performance_rating: number | null;
  training_symptoms: string[];
  intensity_adjustment: number;
  volume_adjustment: number;
  exercises_modified: unknown[];
  notes: string | null;
  created_at: string;
}

export interface CyclePrivacySettings {
  id: string;
  client_id: string;
  share_phase: boolean;
  share_symptoms: boolean;
  share_mood: boolean;
  share_flow: boolean;
  share_energy: boolean;
  share_predictions: boolean;
  anonymous_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhaseAdjustment {
  intensity: number;
  volume: number;
  notes: string | null;
}

export interface PhaseTrainingSuggestion {
  phase: CyclePhase;
  cycleDay: number;
  intensityMod: number;
  volumeMod: number;
  trainerNotes: string | null;
  autoSuggestions: string[];
}

// Phase-specific auto-suggestions based on symptoms
const SYMPTOM_ADJUSTMENTS: Record<string, { intensityMod: number; suggestion: string }> = {
  cramps: { intensityMod: -15, suggestion: "cycleTraining.suggestion.cramps" },
  fatigue: { intensityMod: -10, suggestion: "cycleTraining.suggestion.fatigue" },
  headache: { intensityMod: -10, suggestion: "cycleTraining.suggestion.headache" },
  bloating: { intensityMod: -5, suggestion: "cycleTraining.suggestion.bloating" },
  insomnia: { intensityMod: -10, suggestion: "cycleTraining.suggestion.insomnia" },
  back_pain: { intensityMod: -10, suggestion: "cycleTraining.suggestion.backPain" },
  nausea: { intensityMod: -15, suggestion: "cycleTraining.suggestion.nausea" },
};

export const cycleTrainingService = {
  // ── Trainer: Config management ──

  async getConfig(clientId: string): Promise<CycleTrainingConfig | null> {
    const supabase = createClient();
    const { data } = await supabase
      .from("cycle_training_config")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();
    return data as CycleTrainingConfig | null;
  },

  async upsertConfig(
    clientId: string,
    config: Partial<Omit<CycleTrainingConfig, "id" | "client_id" | "trainer_id" | "created_at" | "updated_at">>
  ): Promise<CycleTrainingConfig> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const existing = await this.getConfig(clientId);

    if (existing) {
      const { data, error } = await supabase
        .from("cycle_training_config")
        .update(config)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data as CycleTrainingConfig;
    }

    const { data, error } = await supabase
      .from("cycle_training_config")
      .insert({
        client_id: clientId,
        trainer_id: user.id,
        ...config,
      })
      .select()
      .single();
    if (error) throw error;
    return data as CycleTrainingConfig;
  },

  // ── Client: Get training suggestion for current phase ──

  async getTrainingSuggestion(
    cycleDay: number,
    phase: CyclePhase,
    todaySymptoms: string[]
  ): Promise<PhaseTrainingSuggestion | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get client_id
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) return null;

    // Get trainer config for this client
    const { data: config } = await supabase
      .from("cycle_training_config")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle();

    if (!config || !config.enabled) return null;

    const phaseKey = phase as string;
    const baseMod = {
      intensity: config[`${phaseKey}_intensity` as keyof typeof config] as number || 0,
      volume: config[`${phaseKey}_volume` as keyof typeof config] as number || 0,
      notes: config[`${phaseKey}_notes` as keyof typeof config] as string | null,
    };

    // Auto-adjust based on symptoms
    const autoSuggestions: string[] = [];
    let symptomIntensityMod = 0;

    if (config.auto_adjust && todaySymptoms.length > 0) {
      for (const symptom of todaySymptoms) {
        const adj = SYMPTOM_ADJUSTMENTS[symptom];
        if (adj) {
          symptomIntensityMod = Math.min(symptomIntensityMod, adj.intensityMod);
          autoSuggestions.push(adj.suggestion);
        }
      }
    }

    return {
      phase,
      cycleDay,
      intensityMod: baseMod.intensity + symptomIntensityMod,
      volumeMod: baseMod.volume,
      trainerNotes: baseMod.notes,
      autoSuggestions,
    };
  },

  // ── Client: Performance logging ──

  async logPerformance(data: {
    workout_log_id?: string;
    date: string;
    cycle_day?: number;
    phase?: CyclePhase;
    perceived_effort?: number;
    energy_before?: number;
    energy_after?: number;
    performance_rating?: number;
    training_symptoms?: string[];
    intensity_adjustment?: number;
    volume_adjustment?: number;
    notes?: string;
  }): Promise<CyclePerformanceLog> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) throw new Error("No client record");

    const { data: log, error } = await supabase
      .from("cycle_performance_logs")
      .insert({
        client_id: client.id,
        ...data,
      })
      .select()
      .single();

    if (error) throw error;
    return log as CyclePerformanceLog;
  },

  // ── Trainer: Get performance logs for analysis ──

  async getPerformanceLogs(
    clientId: string,
    options?: { limit?: number; phase?: CyclePhase }
  ): Promise<CyclePerformanceLog[]> {
    const supabase = createClient();
    let query = supabase
      .from("cycle_performance_logs")
      .select("*")
      .eq("client_id", clientId)
      .order("date", { ascending: false });

    if (options?.phase) {
      query = query.eq("phase", options.phase);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as CyclePerformanceLog[];
  },

  // ── Trainer: Get phase summary stats ──

  async getPhaseStats(clientId: string): Promise<Record<CyclePhase, {
    avgEffort: number;
    avgEnergyBefore: number;
    avgEnergyAfter: number;
    avgPerformance: number;
    count: number;
  }>> {
    const logs = await this.getPerformanceLogs(clientId, { limit: 100 });

    const phases: CyclePhase[] = ["menstrual", "follicular", "ovulation", "luteal"];
    const result = {} as Record<CyclePhase, {
      avgEffort: number;
      avgEnergyBefore: number;
      avgEnergyAfter: number;
      avgPerformance: number;
      count: number;
    }>;

    for (const phase of phases) {
      const phaseLogs = logs.filter((l) => l.phase === phase);
      const count = phaseLogs.length;
      if (count === 0) {
        result[phase] = { avgEffort: 0, avgEnergyBefore: 0, avgEnergyAfter: 0, avgPerformance: 0, count: 0 };
        continue;
      }

      result[phase] = {
        avgEffort: phaseLogs.reduce((s, l) => s + (l.perceived_effort || 0), 0) / count,
        avgEnergyBefore: phaseLogs.reduce((s, l) => s + (l.energy_before || 0), 0) / count,
        avgEnergyAfter: phaseLogs.reduce((s, l) => s + (l.energy_after || 0), 0) / count,
        avgPerformance: phaseLogs.reduce((s, l) => s + (l.performance_rating || 0), 0) / count,
        count,
      };
    }

    return result;
  },

  // ── Client: Privacy settings ──

  async getPrivacySettings(): Promise<CyclePrivacySettings> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) throw new Error("No client record");

    const { data } = await supabase
      .from("cycle_privacy_settings")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle();

    if (data) return data as CyclePrivacySettings;

    // Create defaults
    const { data: created, error } = await supabase
      .from("cycle_privacy_settings")
      .insert({
        client_id: client.id,
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      })
      .select()
      .single();

    if (error) throw error;
    return created as CyclePrivacySettings;
  },

  async updatePrivacySettings(
    data: Partial<Omit<CyclePrivacySettings, "id" | "client_id" | "created_at" | "updated_at">>
  ): Promise<CyclePrivacySettings> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!client) throw new Error("No client record");

    const { data: updated, error } = await supabase
      .from("cycle_privacy_settings")
      .update(data)
      .eq("client_id", client.id)
      .select()
      .single();

    if (error) throw error;
    return updated as CyclePrivacySettings;
  },

  // ── Trainer: Get privacy-filtered cycle info for a client ──

  async getClientCycleInfoFiltered(clientId: string): Promise<{
    phase: CyclePhase | null;
    cycleDay: number | null;
    energy: number | null;
    anonymous: boolean;
  } | null> {
    const supabase = createClient();

    // Get privacy settings
    const { data: privacy } = await supabase
      .from("cycle_privacy_settings")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    // Get menstrual settings for phase calculation
    const { data: settings } = await supabase
      .from("menstrual_settings")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (!settings?.last_period_start) return null;

    // Mismo cálculo que menstrual.service (fecha local + módulo positivo y
    // límites de fase sin floor) para que trainer y cliente vean la misma fase
    const lastStart = parseLocalDate(settings.last_period_start);
    const today = new Date();
    const diffDays = daysBetweenLocal(lastStart, today);
    const cycleLen = settings.average_cycle_length || 28;
    const periodLen = settings.average_period_length || 5;
    const cycleDay = (((diffDays % cycleLen) + cycleLen) % cycleLen) + 1;

    let phase: CyclePhase;
    if (cycleDay <= periodLen) phase = "menstrual";
    else if (cycleDay <= cycleLen * 0.5) phase = "follicular";
    else if (cycleDay <= cycleLen * 0.5 + 2) phase = "ovulation";
    else phase = "luteal";

    // Get latest energy
    const todayStr = localDateString(today);
    const { data: todayLog } = await supabase
      .from("menstrual_logs")
      .select("energy_level")
      .eq("client_id", clientId)
      .eq("date", todayStr)
      .maybeSingle();

    // Apply privacy filters
    if (privacy?.anonymous_mode) {
      return { phase: null, cycleDay: null, energy: null, anonymous: true };
    }

    return {
      phase: privacy?.share_phase !== false ? phase : null,
      cycleDay: privacy?.share_phase !== false ? cycleDay : null,
      energy: privacy?.share_energy !== false ? (todayLog?.energy_level ?? null) : null,
      anonymous: false,
    };
  },
};
