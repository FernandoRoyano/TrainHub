import { describe, it, expect } from "vitest";
import { exerciseKey, topSetWeightKg, volumeKg } from "@/lib/exercise-log-metrics";

const set = (reps: string, weight: number | null) => ({
  set: 1, reps, weight, rir: null, rest_seconds: null, note: "",
});

describe("exercise-log-metrics", () => {
  const base = { routine_exercise_id: "re-1", sets_completed: 3, weight_used: 70 };

  it("exerciseKey prefers exercise_id so progress survives routine changes", () => {
    expect(exerciseKey({ ...base, routine_exercise: { exercise_id: "ex-bench" } })).toBe("ex-bench");
    expect(exerciseKey({ ...base, routine_exercise: null })).toBe("re-1");
  });

  it("topSetWeightKg uses the heaviest set, not the average", () => {
    const el = { ...base, set_logs: [set("10", 60), set("8", 70), set("6", 80)] };
    expect(topSetWeightKg(el)).toBe(80);
  });

  it("topSetWeightKg falls back to weight_used for legacy logs", () => {
    expect(topSetWeightKg({ ...base, set_logs: null })).toBe(70);
    expect(topSetWeightKg({ ...base, set_logs: [set("10", null)] })).toBe(70);
    expect(topSetWeightKg({ ...base, weight_used: null, set_logs: [] })).toBeNull();
  });

  it("volumeKg sums reps×weight per set, with legacy fallback", () => {
    const el = { ...base, set_logs: [set("10", 60), set("8", 70), set("x", 80)] };
    expect(volumeKg(el)).toBe(600 + 560);
    expect(volumeKg({ ...base, set_logs: null })).toBe(210);
  });
});
