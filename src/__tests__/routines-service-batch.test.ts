import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RoutineFormData } from "@/lib/validations/routine";

// Captura de inserts por tabla
const inserts: Record<string, unknown[][]> = {};
const deletes: string[] = [];

const mockGetUser = vi.fn();

function chainFor(table: string) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.insert = vi.fn().mockImplementation((payload: unknown) => {
    const rows = Array.isArray(payload) ? payload : [payload];
    inserts[table] = inserts[table] ?? [];
    inserts[table].push(rows);
    return chain;
  });
  chain.select = vi.fn().mockImplementation(() => {
    // Devuelve filas simulando la respuesta del insert batch
    const lastRows = (inserts[table]?.at(-1) ?? []) as Record<string, unknown>[];
    if (table === "routine_days") {
      const data = lastRows.map((r, i) => ({
        id: `day-${r.day_number}`,
        day_number: r.day_number,
        _i: i,
      }));
      return { ...chain, then: (res: (v: unknown) => void) => Promise.resolve({ data, error: null }).then(res) };
    }
    if (table === "exercise_groups") {
      // CLAVE: devolver las filas EN ORDEN INVERSO para verificar que el
      // mapeo de ids no depende de la posición del array
      const data = lastRows
        .map((r) => ({
          id: `group-${r.routine_day_id}-${r.order_index}`,
          routine_day_id: r.routine_day_id,
          order_index: r.order_index,
        }))
        .reverse();
      return { ...chain, then: (res: (v: unknown) => void) => Promise.resolve({ data, error: null }).then(res) };
    }
    return { ...chain, then: (res: (v: unknown) => void) => Promise.resolve({ data: lastRows, error: null }).then(res) };
  });
  chain.single = vi.fn().mockImplementation(() => {
    const lastRows = (inserts[table]?.at(-1) ?? []) as Record<string, unknown>[];
    return Promise.resolve({ data: { id: "routine-1", ...lastRows[0] }, error: null });
  });
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockImplementation(() => {
    deletes.push(table);
    return chain;
  });
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.then = vi.fn().mockImplementation((res: (v: unknown) => void) =>
    Promise.resolve({ data: null, error: null }).then(res)
  );
  return chain;
}

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
    getSession: async () => {
      const { data } = await mockGetUser();
      return { data: { session: data?.user ? { user: data.user } : null } };
    },
  },
  from: vi.fn().mockImplementation((table: string) => chainFor(table)),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const { routinesService } = await import("@/services/routines.service");

function makeFormData(): RoutineFormData {
  return {
    name: "Test",
    description: "",
    final_notes: "",
    duration_weeks: 4,
    days_per_week: 2,
    difficulty: "intermediate" as const,
    target_gender: "unisex" as const,
    is_template: false,
    cover_image: "",
    days: [
      {
        day_number: 1,
        name: "Push",
        notes: "",
        description: "",
        groups: [
          {
            group_type: "superset" as const,
            order_index: 0,
            rounds: null,
            time_limit_seconds: null,
            rest_between_rounds: null,
            label: "",
            notes: "",
            exercises: [
              { exercise_id: "11111111-1111-1111-1111-111111111111", order_index: 0, sets: 3, reps: "10", rest_seconds: 60, notes: "", superset_group: 0 },
              { exercise_id: "22222222-2222-2222-2222-222222222222", order_index: 1, sets: 3, reps: "10", rest_seconds: 60, notes: "", superset_group: 0 },
            ],
          },
          {
            group_type: "circuit" as const,
            order_index: 1,
            rounds: 3,
            time_limit_seconds: null,
            rest_between_rounds: 60,
            label: "",
            notes: "",
            exercises: [
              { exercise_id: "33333333-3333-3333-3333-333333333333", order_index: 0, sets: 3, reps: "12", rest_seconds: 30, notes: "", superset_group: 1 },
            ],
          },
        ],
        exercises: [],
      },
      {
        day_number: 2,
        name: "Pull",
        notes: "",
        description: "",
        groups: [
          {
            group_type: "solo" as const,
            order_index: 0,
            rounds: null,
            time_limit_seconds: null,
            rest_between_rounds: null,
            label: "",
            notes: "",
            exercises: [
              { exercise_id: "44444444-4444-4444-4444-444444444444", order_index: 0, sets: 4, reps: "8", rest_seconds: 90, notes: "", superset_group: null },
            ],
          },
        ],
        exercises: [],
      },
    ],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const k of Object.keys(inserts)) delete inserts[k];
  deletes.length = 0;
  mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
});

describe("routinesService.createRoutine (guardado batched)", () => {
  it("hace exactamente 1 insert de grupos y 1 de ejercicios", async () => {
    await routinesService.createRoutine(makeFormData());

    expect(inserts["routine_days"]).toHaveLength(1);
    expect(inserts["exercise_groups"]).toHaveLength(1);
    expect(inserts["routine_exercises"]).toHaveLength(1);
    // Todos los grupos de todos los días en el mismo insert
    expect(inserts["exercise_groups"][0]).toHaveLength(3);
    expect(inserts["routine_exercises"][0]).toHaveLength(4);
  });

  it("resuelve exercise_group_id por (routine_day_id, order_index) aunque las filas vuelvan desordenadas", async () => {
    await routinesService.createRoutine(makeFormData());

    const exercises = inserts["routine_exercises"][0] as Record<string, unknown>[];
    // El mock devuelve los grupos en orden INVERSO; el id correcto es group-<dayId>-<orderIndex>
    const bySupersetPair = exercises.filter((e) => e.superset_group === 0);
    expect(bySupersetPair.every((e) => e.exercise_group_id === "group-day-1-0")).toBe(true);
    const circuitEx = exercises.find((e) => e.exercise_id === "33333333-3333-3333-3333-333333333333");
    expect(circuitEx?.exercise_group_id).toBe("group-day-1-1");
    const day2Ex = exercises.find((e) => e.exercise_id === "44444444-4444-4444-4444-444444444444");
    expect(day2Ex?.exercise_group_id).toBe("group-day-2-0");
    expect(day2Ex?.routine_day_id).toBe("day-2");
  });

  it("ruta plana retrocompat: días sin groups insertan ejercicios con exercise_group_id null", async () => {
    const data = makeFormData();
    data.days = [
      {
        day_number: 1,
        name: "Flat",
        notes: "",
        description: "",
        groups: [],
        exercises: [
          { exercise_id: "55555555-5555-5555-5555-555555555555", order_index: 0, sets: 3, reps: "10", rest_seconds: 60, notes: "", superset_group: null },
          { exercise_id: "66666666-6666-6666-6666-666666666666", order_index: 1, sets: 3, reps: "10", rest_seconds: 60, notes: "", superset_group: null },
        ],
      },
    ];
    await routinesService.createRoutine(data);

    expect(inserts["exercise_groups"]).toBeUndefined();
    const exercises = inserts["routine_exercises"][0] as Record<string, unknown>[];
    expect(exercises).toHaveLength(2);
    expect(exercises.every((e) => e.exercise_group_id === null)).toBe(true);
  });
});

describe("routinesService.updateRoutine (guardado batched)", () => {
  it("borra días y re-inserta batched", async () => {
    await routinesService.updateRoutine("routine-1", makeFormData());

    expect(deletes).toContain("routine_days");
    expect(inserts["routine_days"]).toHaveLength(1);
    expect(inserts["exercise_groups"]).toHaveLength(1);
    expect(inserts["routine_exercises"]).toHaveLength(1);
  });
});
