import { describe, it, expect } from "vitest";
import {
  MUSCLE_GROUPS,
  EQUIPMENT,
  DIFFICULTY_LEVELS,
  CLIENT_STATUSES,
  SUBSCRIPTION_TIERS,
  PUBLIC_ROUTES,
  BLOCK_TYPES,
  MEAL_TYPES,
} from "@/lib/constants";

describe("Constants", () => {
  it("MUSCLE_GROUPS contains expected entries", () => {
    expect(MUSCLE_GROUPS).toContain("chest");
    expect(MUSCLE_GROUPS).toContain("back");
    expect(MUSCLE_GROUPS).toContain("core");
    expect(MUSCLE_GROUPS.length).toBeGreaterThan(10);
  });

  it("EQUIPMENT contains common items", () => {
    expect(EQUIPMENT).toContain("barbell");
    expect(EQUIPMENT).toContain("dumbbell");
    expect(EQUIPMENT).toContain("bodyweight");
  });

  it("DIFFICULTY_LEVELS has 3 levels", () => {
    expect(DIFFICULTY_LEVELS).toEqual(["beginner", "intermediate", "advanced"]);
  });

  it("CLIENT_STATUSES has correct values", () => {
    expect(CLIENT_STATUSES).toEqual(["active", "inactive", "paused", "pending"]);
  });

  it("SUBSCRIPTION_TIERS has free, pro, elite", () => {
    expect(SUBSCRIPTION_TIERS).toEqual(["free", "pro", "elite"]);
  });

  it("PUBLIC_ROUTES includes auth routes", () => {
    expect(PUBLIC_ROUTES).toContain("/login");
    expect(PUBLIC_ROUTES).toContain("/register");
    expect(PUBLIC_ROUTES).toContain("/forgot-password");
    expect(PUBLIC_ROUTES).toContain("/auth/callback");
  });

  it("PUBLIC_ROUTES does not include protected routes", () => {
    expect(PUBLIC_ROUTES).not.toContain("/dashboard");
    expect(PUBLIC_ROUTES).not.toContain("/admin");
    expect(PUBLIC_ROUTES).not.toContain("/my-routine");
  });

  it("BLOCK_TYPES has expected values", () => {
    expect(BLOCK_TYPES).toEqual(["warmup", "cooldown", "circuit", "custom"]);
  });

  it("MEAL_TYPES includes standard meals", () => {
    expect(MEAL_TYPES).toContain("breakfast");
    expect(MEAL_TYPES).toContain("lunch");
    expect(MEAL_TYPES).toContain("dinner");
    expect(MEAL_TYPES).toContain("pre_workout");
    expect(MEAL_TYPES).toContain("post_workout");
  });
});
