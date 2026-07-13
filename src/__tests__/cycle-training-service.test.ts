import { describe, it, expect, vi, beforeEach } from "vitest";

// Supabase chain mock helper
function createChain(resolvedValue?: unknown) {
  const defaultResolved = resolvedValue ?? { data: null, error: null };
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.in = vi.fn().mockReturnValue(chain);
  chain.gte = vi.fn().mockReturnValue(chain);
  chain.lt = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.maybeSingle = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.then = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    return Promise.resolve(defaultResolved).then(resolve);
  });
  return chain;
}

const mockGetUser = vi.fn();
let chainForTable: Record<string, ReturnType<typeof createChain>> = {};

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
    getSession: async () => {
      const { data } = await mockGetUser();
      return { data: { session: data?.user ? { user: data.user } : null } };
    },
  },
  from: vi.fn().mockImplementation((table: string) => {
    if (chainForTable[table]) return chainForTable[table];
    return createChain();
  }),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const { cycleTrainingService } = await import("@/services/cycle-training.service");

describe("cycleTrainingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  // ─── getConfig ───

  describe("getConfig", () => {
    it("returns config for a client", async () => {
      const config = {
        id: "cfg-1",
        client_id: "client-1",
        trainer_id: "trainer-1",
        enabled: true,
        menstrual_intensity: -20,
        menstrual_volume: -15,
      };
      const chain = createChain();
      chain.maybeSingle = vi.fn().mockResolvedValue({ data: config, error: null });
      chainForTable["cycle_training_config"] = chain;

      const result = await cycleTrainingService.getConfig("client-1");

      expect(mockSupabase.from).toHaveBeenCalledWith("cycle_training_config");
      expect(chain.eq).toHaveBeenCalledWith("client_id", "client-1");
      expect(result).toEqual(config);
    });

    it("returns null when no config exists", async () => {
      const chain = createChain();
      chain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      chainForTable["cycle_training_config"] = chain;

      const result = await cycleTrainingService.getConfig("client-no-config");
      expect(result).toBeNull();
    });
  });

  // ─── upsertConfig ───

  describe("upsertConfig", () => {
    it("throws when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(
        cycleTrainingService.upsertConfig("client-1", { enabled: true })
      ).rejects.toThrow("Not authenticated");
    });

    it("creates new config when none exists", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

      const createdConfig = {
        id: "cfg-new",
        client_id: "client-1",
        trainer_id: "trainer-1",
        enabled: true,
      };

      // The service calls from("cycle_training_config") twice:
      // 1st: getConfig (select -> maybeSingle returns null)
      // 2nd: insert (insert -> single returns created)
      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "cycle_training_config") {
          callCount++;
          if (callCount === 1) {
            // getConfig call
            const chain = createChain();
            chain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
            return chain;
          }
          // insert call
          const chain = createChain();
          chain.single = vi.fn().mockResolvedValue({ data: createdConfig, error: null });
          return chain;
        }
        return createChain();
      });

      const result = await cycleTrainingService.upsertConfig("client-1", { enabled: true });

      expect(result).toEqual(createdConfig);
    });

    it("updates existing config", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

      const existingConfig = { id: "cfg-1", client_id: "client-1", trainer_id: "trainer-1" };
      const updatedConfig = { ...existingConfig, enabled: false };

      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "cycle_training_config") {
          callCount++;
          if (callCount === 1) {
            // getConfig call
            const chain = createChain();
            chain.maybeSingle = vi.fn().mockResolvedValue({ data: existingConfig, error: null });
            return chain;
          }
          // update call
          const chain = createChain();
          chain.single = vi.fn().mockResolvedValue({ data: updatedConfig, error: null });
          return chain;
        }
        return createChain();
      });

      const result = await cycleTrainingService.upsertConfig("client-1", { enabled: false });

      expect(result).toEqual(updatedConfig);
    });
  });

  // ─── getTrainingSuggestion ───

  describe("getTrainingSuggestion", () => {
    it("throws when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(
        cycleTrainingService.getTrainingSuggestion(5, "follicular", [])
      ).rejects.toThrow("Not authenticated");
    });

    it("returns null when no client record found", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: null, error: null });
      chainForTable["clients"] = clientChain;

      const result = await cycleTrainingService.getTrainingSuggestion(5, "follicular", []);
      expect(result).toBeNull();
    });

    it("returns null when config is disabled", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const configChain = createChain();
      configChain.maybeSingle = vi.fn().mockResolvedValue({
        data: { enabled: false },
        error: null,
      });
      chainForTable["cycle_training_config"] = configChain;

      const result = await cycleTrainingService.getTrainingSuggestion(5, "follicular", []);
      expect(result).toBeNull();
    });

    it("returns suggestion with base adjustments for phase", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const configChain = createChain();
      configChain.maybeSingle = vi.fn().mockResolvedValue({
        data: {
          enabled: true,
          auto_adjust: false,
          menstrual_intensity: -20,
          menstrual_volume: -15,
          menstrual_notes: "Prioriza yoga",
          follicular_intensity: 5,
          follicular_volume: 0,
          follicular_notes: null,
          ovulation_intensity: 10,
          ovulation_volume: 5,
          ovulation_notes: null,
          luteal_intensity: -10,
          luteal_volume: -10,
          luteal_notes: null,
        },
        error: null,
      });
      chainForTable["cycle_training_config"] = configChain;

      const result = await cycleTrainingService.getTrainingSuggestion(3, "menstrual", []);

      expect(result).not.toBeNull();
      expect(result!.phase).toBe("menstrual");
      expect(result!.cycleDay).toBe(3);
      expect(result!.intensityMod).toBe(-20);
      expect(result!.volumeMod).toBe(-15);
      expect(result!.trainerNotes).toBe("Prioriza yoga");
      expect(result!.autoSuggestions).toEqual([]);
    });

    it("adds symptom-based auto-adjustments when enabled", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const configChain = createChain();
      configChain.maybeSingle = vi.fn().mockResolvedValue({
        data: {
          enabled: true,
          auto_adjust: true,
          menstrual_intensity: -20,
          menstrual_volume: -15,
          menstrual_notes: null,
          follicular_intensity: 0,
          follicular_volume: 0,
          follicular_notes: null,
          ovulation_intensity: 10,
          ovulation_volume: 5,
          ovulation_notes: null,
          luteal_intensity: -10,
          luteal_volume: -10,
          luteal_notes: null,
        },
        error: null,
      });
      chainForTable["cycle_training_config"] = configChain;

      const result = await cycleTrainingService.getTrainingSuggestion(
        2, "menstrual", ["cramps", "fatigue"]
      );

      expect(result).not.toBeNull();
      // Base -20 + worst symptom adjustment (-15 from cramps)
      expect(result!.intensityMod).toBe(-35);
      expect(result!.autoSuggestions).toHaveLength(2);
      expect(result!.autoSuggestions).toContain("cycleTraining.suggestion.cramps");
      expect(result!.autoSuggestions).toContain("cycleTraining.suggestion.fatigue");
    });
  });

  // ─── logPerformance ───

  describe("logPerformance", () => {
    it("throws when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(
        cycleTrainingService.logPerformance({ date: "2026-04-06", perceived_effort: 7 })
      ).rejects.toThrow("Not authenticated");
    });

    it("creates a performance log", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const logData = {
        id: "log-1",
        client_id: "client-1",
        date: "2026-04-06",
        perceived_effort: 7,
        phase: "follicular",
      };
      const insertChain = createChain();
      insertChain.single = vi.fn().mockResolvedValue({ data: logData, error: null });
      chainForTable["cycle_performance_logs"] = insertChain;

      const result = await cycleTrainingService.logPerformance({
        date: "2026-04-06",
        perceived_effort: 7,
        phase: "follicular",
      });

      expect(result).toEqual(logData);
      expect(insertChain.insert).toHaveBeenCalled();
    });
  });

  // ─── getPerformanceLogs ───

  describe("getPerformanceLogs", () => {
    it("returns logs for a client", async () => {
      const logs = [
        { id: "log-1", phase: "menstrual", perceived_effort: 5 },
        { id: "log-2", phase: "follicular", perceived_effort: 7 },
      ];

      const chain = createChain({ data: logs, error: null });
      chainForTable["cycle_performance_logs"] = chain;

      const result = await cycleTrainingService.getPerformanceLogs("client-1");

      expect(mockSupabase.from).toHaveBeenCalledWith("cycle_performance_logs");
      expect(chain.eq).toHaveBeenCalledWith("client_id", "client-1");
      expect(result).toEqual(logs);
    });

    it("filters by phase when specified", async () => {
      const chain = createChain({ data: [], error: null });
      chainForTable["cycle_performance_logs"] = chain;

      await cycleTrainingService.getPerformanceLogs("client-1", { phase: "ovulation" });

      expect(chain.eq).toHaveBeenCalledWith("phase", "ovulation");
    });

    it("applies limit", async () => {
      const chain = createChain({ data: [], error: null });
      chainForTable["cycle_performance_logs"] = chain;

      await cycleTrainingService.getPerformanceLogs("client-1", { limit: 10 });

      expect(chain.limit).toHaveBeenCalledWith(10);
    });
  });

  // ─── getPhaseStats ───

  describe("getPhaseStats", () => {
    it("returns averaged stats grouped by phase", async () => {
      const logs = [
        { phase: "menstrual", perceived_effort: 4, energy_before: 2, energy_after: 3, performance_rating: 3 },
        { phase: "menstrual", perceived_effort: 6, energy_before: 3, energy_after: 3, performance_rating: 3 },
        { phase: "follicular", perceived_effort: 7, energy_before: 4, energy_after: 4, performance_rating: 4 },
      ];

      const chain = createChain({ data: logs, error: null });
      chainForTable["cycle_performance_logs"] = chain;

      const result = await cycleTrainingService.getPhaseStats("client-1");

      expect(result.menstrual.count).toBe(2);
      expect(result.menstrual.avgEffort).toBe(5);
      expect(result.menstrual.avgPerformance).toBe(3);

      expect(result.follicular.count).toBe(1);
      expect(result.follicular.avgEffort).toBe(7);

      expect(result.ovulation.count).toBe(0);
      expect(result.ovulation.avgEffort).toBe(0);

      expect(result.luteal.count).toBe(0);
    });
  });

  // ─── getPrivacySettings ───

  describe("getPrivacySettings", () => {
    it("throws when not authenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      await expect(cycleTrainingService.getPrivacySettings()).rejects.toThrow("Not authenticated");
    });

    it("returns existing privacy settings", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const privacy = {
        id: "priv-1",
        client_id: "client-1",
        share_phase: true,
        share_symptoms: false,
        anonymous_mode: false,
      };
      const privacyChain = createChain();
      privacyChain.maybeSingle = vi.fn().mockResolvedValue({ data: privacy, error: null });
      chainForTable["cycle_privacy_settings"] = privacyChain;

      const result = await cycleTrainingService.getPrivacySettings();
      expect(result).toEqual(privacy);
    });

    it("creates default settings when none exist", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const defaultPrivacy = {
        id: "priv-new",
        client_id: "client-1",
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      };

      // First maybeSingle: null (not found), then insert
      const privacyChain = createChain();
      privacyChain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      privacyChain.single = vi.fn().mockResolvedValue({ data: defaultPrivacy, error: null });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "clients") return clientChain;
        if (table === "cycle_privacy_settings") {
          return privacyChain;
        }
        return createChain();
      });

      const result = await cycleTrainingService.getPrivacySettings();

      expect(privacyChain.insert).toHaveBeenCalled();
      expect(result).toEqual(defaultPrivacy);
    });
  });

  // ─── updatePrivacySettings ───

  describe("updatePrivacySettings", () => {
    it("updates privacy settings", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

      const clientChain = createChain();
      clientChain.single = vi.fn().mockResolvedValue({ data: { id: "client-1" }, error: null });
      chainForTable["clients"] = clientChain;

      const updated = { share_phase: false, anonymous_mode: true };
      const privacyChain = createChain();
      privacyChain.single = vi.fn().mockResolvedValue({ data: updated, error: null });
      chainForTable["cycle_privacy_settings"] = privacyChain;

      const result = await cycleTrainingService.updatePrivacySettings({
        share_phase: false,
        anonymous_mode: true,
      });

      expect(privacyChain.update).toHaveBeenCalledWith({
        share_phase: false,
        anonymous_mode: true,
      });
      expect(result).toEqual(updated);
    });
  });

  // ─── getClientCycleInfoFiltered ───

  describe("getClientCycleInfoFiltered", () => {
    it("returns null when no menstrual settings exist", async () => {
      const privacyChain = createChain();
      privacyChain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      chainForTable["cycle_privacy_settings"] = privacyChain;

      const settingsChain = createChain();
      settingsChain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      chainForTable["menstrual_settings"] = settingsChain;

      const result = await cycleTrainingService.getClientCycleInfoFiltered("client-1");
      expect(result).toBeNull();
    });

    it("returns anonymous when anonymous_mode is on", async () => {
      const privacyChain = createChain();
      privacyChain.maybeSingle = vi.fn().mockResolvedValue({
        data: { anonymous_mode: true },
        error: null,
      });
      chainForTable["cycle_privacy_settings"] = privacyChain;

      const settingsChain = createChain();
      settingsChain.maybeSingle = vi.fn().mockResolvedValue({
        data: {
          last_period_start: "2026-03-20",
          average_cycle_length: 28,
          average_period_length: 5,
        },
        error: null,
      });
      chainForTable["menstrual_settings"] = settingsChain;

      const logChain = createChain();
      logChain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      chainForTable["menstrual_logs"] = logChain;

      const result = await cycleTrainingService.getClientCycleInfoFiltered("client-1");

      expect(result).not.toBeNull();
      expect(result!.anonymous).toBe(true);
      expect(result!.phase).toBeNull();
      expect(result!.cycleDay).toBeNull();
    });

    it("respects share_phase=false by hiding phase and cycleDay", async () => {
      const privacyChain = createChain();
      privacyChain.maybeSingle = vi.fn().mockResolvedValue({
        data: { anonymous_mode: false, share_phase: false, share_energy: true },
        error: null,
      });
      chainForTable["cycle_privacy_settings"] = privacyChain;

      const settingsChain = createChain();
      settingsChain.maybeSingle = vi.fn().mockResolvedValue({
        data: {
          last_period_start: "2026-03-20",
          average_cycle_length: 28,
          average_period_length: 5,
        },
        error: null,
      });
      chainForTable["menstrual_settings"] = settingsChain;

      const logChain = createChain();
      logChain.maybeSingle = vi.fn().mockResolvedValue({ data: { energy_level: 4 }, error: null });
      chainForTable["menstrual_logs"] = logChain;

      const result = await cycleTrainingService.getClientCycleInfoFiltered("client-1");

      expect(result).not.toBeNull();
      expect(result!.anonymous).toBe(false);
      expect(result!.phase).toBeNull();
      expect(result!.cycleDay).toBeNull();
      expect(result!.energy).toBe(4);
    });
  });
});
