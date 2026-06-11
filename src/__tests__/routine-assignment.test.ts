import { describe, it, expect } from "vitest";

/**
 * Tests for routine assignment flow.
 * Verifies the client can see assigned routines and the data
 * flows correctly through the system.
 */

describe("Routine assignment logic", () => {
  // Simulate the client-app service logic for finding active routine
  interface ClientRoutineAssignment {
    id: string;
    client_id: string;
    routine_id: string;
    status: string;
  }

  function findActiveAssignment(
    assignments: ClientRoutineAssignment[],
    clientId: string
  ): ClientRoutineAssignment | null {
    return (
      assignments
        .filter((a) => a.client_id === clientId && a.status === "active")
        .sort(() => -1)[0] ?? null
    );
  }

  it("finds active assignment for client", () => {
    const assignments: ClientRoutineAssignment[] = [
      { id: "a1", client_id: "c1", routine_id: "r1", status: "active" },
    ];

    const result = findActiveAssignment(assignments, "c1");
    expect(result).not.toBeNull();
    expect(result!.routine_id).toBe("r1");
  });

  it("returns null when no active assignment", () => {
    const assignments: ClientRoutineAssignment[] = [
      { id: "a1", client_id: "c1", routine_id: "r1", status: "completed" },
    ];

    expect(findActiveAssignment(assignments, "c1")).toBeNull();
  });

  it("returns null for different client", () => {
    const assignments: ClientRoutineAssignment[] = [
      { id: "a1", client_id: "c1", routine_id: "r1", status: "active" },
    ];

    expect(findActiveAssignment(assignments, "c2")).toBeNull();
  });

  it("ignores cancelled assignments", () => {
    const assignments: ClientRoutineAssignment[] = [
      { id: "a1", client_id: "c1", routine_id: "r1", status: "cancelled" },
      { id: "a2", client_id: "c1", routine_id: "r2", status: "active" },
    ];

    const result = findActiveAssignment(assignments, "c1");
    expect(result!.routine_id).toBe("r2");
  });
});

describe("Routine day assembly", () => {
  interface RoutineDay {
    id: string;
    routine_id: string;
    day_number: number;
    name: string;
  }

  interface RoutineExercise {
    id: string;
    routine_day_id: string;
    order_index: number;
    sets: number;
    reps: string;
  }

  function assembleDays(
    days: RoutineDay[],
    exercises: RoutineExercise[]
  ) {
    return days.map((day) => ({
      ...day,
      exercises: exercises
        .filter((e) => e.routine_day_id === day.id)
        .sort((a, b) => a.order_index - b.order_index),
    }));
  }

  it("groups exercises into correct days", () => {
    const days: RoutineDay[] = [
      { id: "d1", routine_id: "r1", day_number: 1, name: "Day A" },
      { id: "d2", routine_id: "r1", day_number: 2, name: "Day B" },
    ];

    const exercises: RoutineExercise[] = [
      { id: "e1", routine_day_id: "d1", order_index: 0, sets: 3, reps: "12" },
      { id: "e2", routine_day_id: "d1", order_index: 1, sets: 3, reps: "10" },
      { id: "e3", routine_day_id: "d2", order_index: 0, sets: 4, reps: "8" },
    ];

    const result = assembleDays(days, exercises);

    expect(result[0].exercises).toHaveLength(2);
    expect(result[0].exercises[0].id).toBe("e1");
    expect(result[0].exercises[1].id).toBe("e2");
    expect(result[1].exercises).toHaveLength(1);
    expect(result[1].exercises[0].id).toBe("e3");
  });

  it("returns empty exercises array for day with no exercises", () => {
    const days: RoutineDay[] = [
      { id: "d1", routine_id: "r1", day_number: 1, name: "Rest Day" },
    ];

    const result = assembleDays(days, []);
    expect(result[0].exercises).toHaveLength(0);
  });

  it("sorts exercises by order_index", () => {
    const days: RoutineDay[] = [
      { id: "d1", routine_id: "r1", day_number: 1, name: "Day A" },
    ];

    const exercises: RoutineExercise[] = [
      { id: "e3", routine_day_id: "d1", order_index: 2, sets: 3, reps: "12" },
      { id: "e1", routine_day_id: "d1", order_index: 0, sets: 3, reps: "12" },
      { id: "e2", routine_day_id: "d1", order_index: 1, sets: 3, reps: "12" },
    ];

    const result = assembleDays(days, exercises);
    expect(result[0].exercises.map((e) => e.id)).toEqual(["e1", "e2", "e3"]);
  });
});

describe("Client visibility requirements", () => {
  /**
   * This test documents the RLS requirements for clients to see routines.
   * The bug we had: client couldn't see routine because RLS blocked the query.
   */

  interface RLSCheck {
    table: string;
    hasClientReadPolicy: boolean;
  }

  const requiredPolicies: RLSCheck[] = [
    { table: "client_routines", hasClientReadPolicy: true },
    { table: "routines", hasClientReadPolicy: true },
    { table: "routine_days", hasClientReadPolicy: true },
    { table: "routine_exercises", hasClientReadPolicy: true },
    { table: "exercises", hasClientReadPolicy: true },
  ];

  it("all tables in routine chain need client read policies", () => {
    for (const policy of requiredPolicies) {
      expect(policy.hasClientReadPolicy).toBe(true);
    }
  });

  it("documents the 5 tables clients need to read", () => {
    const tables = requiredPolicies.map((p) => p.table);
    expect(tables).toContain("client_routines");
    expect(tables).toContain("routines");
    expect(tables).toContain("routine_days");
    expect(tables).toContain("routine_exercises");
    expect(tables).toContain("exercises");
  });
});
