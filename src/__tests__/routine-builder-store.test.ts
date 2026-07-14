import { describe, it, expect, beforeEach } from "vitest";
import { useRoutineBuilderStore } from "@/stores/routine-builder-store";
import type { Exercise } from "@/services/exercises.service";

function makeExercise(id: string, name = `Exercise ${id}`): Exercise {
  return {
    id,
    trainer_id: null,
    name,
    name_es: null,
    slug: null,
    description: null,
    description_es: null,
    instructions: null,
    instructions_es: null,
    video_url: null,
    thumbnail_url: null,
    muscle_groups: [],
    equipment: [],
    difficulty: null,
    category: null,
    primary_muscles: [],
    secondary_muscles: [],
    exercise_type: null,
    mechanics: null,
    force: null,
    images: [],
    source: "custom",
    source_id: null,
    is_public: true,
    created_at: "",
    updated_at: "",
  };
}

// Invariante del store: el array plano siempre debe derivarse de los grupos
function assertFlatMatchesGroups(dayIndex = 0) {
  const day = useRoutineBuilderStore.getState().days[dayIndex];
  const flatIds = day.exercises.map((e) => e.id);
  const groupIds = day.groups.flatMap((g) => g.exercises.map((e) => e.id));
  expect(flatIds).toEqual(groupIds);
  // order_index plano consecutivo 0..n-1
  expect(day.exercises.map((e) => e.order_index)).toEqual(flatIds.map((_, i) => i));
}

describe("routine-builder-store: addExercisesBatch", () => {
  beforeEach(() => {
    useRoutineBuilderStore.getState().reset();
  });

  it("destination solo: crea un grupo solo por ejercicio", () => {
    const { addExercisesBatch } = useRoutineBuilderStore.getState();
    addExercisesBatch(0, [makeExercise("a"), makeExercise("b"), makeExercise("c")], {
      destination: "solo",
    });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups).toHaveLength(3);
    expect(day.groups.every((g) => g.group_type === "solo" && g.exercises.length === 1)).toBe(true);
    expect(day.exercises).toHaveLength(3);
    assertFlatMatchesGroups();
  });

  it("destination superset con 2 ejercicios: un grupo superset", () => {
    const { addExercisesBatch } = useRoutineBuilderStore.getState();
    addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], { destination: "superset" });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups).toHaveLength(1);
    expect(day.groups[0].group_type).toBe("superset");
    expect(day.groups[0].exercises).toHaveLength(2);
    // superset_group derivado en el plano
    expect(day.exercises.every((e) => e.superset_group === day.groups[0].order_index)).toBe(true);
    assertFlatMatchesGroups();
  });

  it("destination superset con 3+ ejercicios: se convierte en triset", () => {
    const { addExercisesBatch } = useRoutineBuilderStore.getState();
    addExercisesBatch(0, [makeExercise("a"), makeExercise("b"), makeExercise("c")], {
      destination: "superset",
    });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups[0].group_type).toBe("triset");
  });

  it("destination circuit: un grupo circuit con rounds 3", () => {
    const { addExercisesBatch } = useRoutineBuilderStore.getState();
    addExercisesBatch(0, [makeExercise("a"), makeExercise("b"), makeExercise("c"), makeExercise("d")], {
      destination: "circuit",
    });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups).toHaveLength(1);
    expect(day.groups[0].group_type).toBe("circuit");
    expect(day.groups[0].rounds).toBe(3);
    expect(day.groups[0].exercises).toHaveLength(4);
    assertFlatMatchesGroups();
  });

  it("aplica los defaults del lote a todos los ejercicios", () => {
    const { addExercisesBatch } = useRoutineBuilderStore.getState();
    addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], {
      destination: "solo",
      defaults: { sets: 4, reps: "8-12", rest_seconds: 90 },
    });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.exercises.every((e) => e.sets === 4 && e.reps === "8-12" && e.rest_seconds === 90)).toBe(true);
  });

  it("groupIndex: añade el lote a un grupo existente sin cambiar su tipo", () => {
    const store = useRoutineBuilderStore.getState();
    store.addGroup(0, "circuit");
    store.addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], {
      destination: "solo", // ignorado al haber groupIndex
      groupIndex: 0,
    });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups).toHaveLength(1);
    expect(day.groups[0].group_type).toBe("circuit");
    expect(day.groups[0].exercises).toHaveLength(2);
    assertFlatMatchesGroups();
  });

  it("añade después de contenido existente sin romper el orden", () => {
    const store = useRoutineBuilderStore.getState();
    store.addExercise(0, makeExercise("first"));
    store.addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], { destination: "superset" });
    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups).toHaveLength(2);
    expect(day.groups[0].group_type).toBe("solo");
    expect(day.groups[1].group_type).toBe("superset");
    expect(day.exercises.map((e) => e.exercise_id)).toEqual(["first", "a", "b"]);
    assertFlatMatchesGroups();
  });
});

describe("routine-builder-store: duplicateDay", () => {
  beforeEach(() => {
    useRoutineBuilderStore.getState().reset();
  });

  it("clona el día completo con ids nuevos y activa el duplicado", () => {
    const store = useRoutineBuilderStore.getState();
    store.updateDay(0, { name: "Push" });
    store.addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], { destination: "superset" });
    store.addExercisesBatch(0, [makeExercise("c")], { destination: "solo" });

    store.duplicateDay(0);

    const state = useRoutineBuilderStore.getState();
    expect(state.days).toHaveLength(2);
    expect(state.activeDayIndex).toBe(1);

    const [original, copy] = state.days;
    expect(copy.day_number).toBe(2);
    expect(copy.name).toBe("Push");
    expect(copy.groups).toHaveLength(original.groups.length);
    expect(copy.groups.map((g) => g.group_type)).toEqual(original.groups.map((g) => g.group_type));

    // Todos los ids regenerados (día, grupos y ejercicios)
    expect(copy.id).not.toBe(original.id);
    const originalIds = new Set([
      ...original.groups.map((g) => g.id),
      ...original.exercises.map((e) => e.id),
    ]);
    for (const g of copy.groups) {
      expect(originalIds.has(g.id)).toBe(false);
      for (const e of g.exercises) expect(originalIds.has(e.id)).toBe(false);
    }
    assertFlatMatchesGroups(1);
  });

  it("mutar la copia no afecta al original (deep clone)", () => {
    const store = useRoutineBuilderStore.getState();
    store.addExercisesBatch(0, [makeExercise("a")], { destination: "solo" });
    store.duplicateDay(0);

    useRoutineBuilderStore.getState().updateExercise(1, 0, { sets: 9 });

    const state = useRoutineBuilderStore.getState();
    expect(state.days[1].exercises[0].sets).toBe(9);
    expect(state.days[0].exercises[0].sets).toBe(3);
  });
});

describe("routine-builder-store: applyDefaultsToDay", () => {
  beforeEach(() => {
    useRoutineBuilderStore.getState().reset();
  });

  it("aplica sets/reps/rest a todos los ejercicios de todos los grupos", () => {
    const store = useRoutineBuilderStore.getState();
    store.addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], { destination: "superset" });
    store.addExercisesBatch(0, [makeExercise("c")], { destination: "solo" });

    store.applyDefaultsToDay(0, { sets: 5, reps: "6", rest_seconds: 120 });

    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.exercises).toHaveLength(3);
    expect(day.exercises.every((e) => e.sets === 5 && e.reps === "6" && e.rest_seconds === 120)).toBe(true);
    // La estructura de grupos no cambia
    expect(day.groups.map((g) => g.group_type)).toEqual(["superset", "solo"]);
    assertFlatMatchesGroups();
  });

  it("no toca otros días", () => {
    const store = useRoutineBuilderStore.getState();
    store.addExercisesBatch(0, [makeExercise("a")], { destination: "solo" });
    store.addDay();
    useRoutineBuilderStore.getState().addExercisesBatch(1, [makeExercise("b")], { destination: "solo" });

    useRoutineBuilderStore.getState().applyDefaultsToDay(1, { sets: 8, reps: "3", rest_seconds: 180 });

    const state = useRoutineBuilderStore.getState();
    expect(state.days[0].exercises[0].sets).toBe(3);
    expect(state.days[1].exercises[0].sets).toBe(8);
  });
});

describe("routine-builder-store: regresión del invariante tras acciones nuevas", () => {
  beforeEach(() => {
    useRoutineBuilderStore.getState().reset();
  });

  it("toggleSuperset sigue funcionando tras un batch", () => {
    const store = useRoutineBuilderStore.getState();
    store.addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], { destination: "solo" });

    // Fusionar el segundo con el primero
    useRoutineBuilderStore.getState().toggleSuperset(0, 1);

    const day = useRoutineBuilderStore.getState().days[0];
    expect(day.groups).toHaveLength(1);
    expect(day.groups[0].group_type).toBe("superset");
    assertFlatMatchesGroups();
  });

  it("moveExerciseBetweenGroups sigue funcionando tras duplicateDay", () => {
    const store = useRoutineBuilderStore.getState();
    store.addExercisesBatch(0, [makeExercise("a"), makeExercise("b")], { destination: "superset" });
    store.addExercisesBatch(0, [makeExercise("c")], { destination: "solo" });
    store.duplicateDay(0);

    const copy = useRoutineBuilderStore.getState().days[1];
    const supersetGroup = copy.groups[0];
    const soloGroup = copy.groups[1];
    const movedId = soloGroup.exercises[0].id;

    useRoutineBuilderStore
      .getState()
      .moveExerciseBetweenGroups(1, movedId, soloGroup.id, supersetGroup.id, 2);

    const day = useRoutineBuilderStore.getState().days[1];
    expect(day.groups).toHaveLength(1);
    // El drag no promociona superset→triset (comportamiento actual del store)
    expect(day.groups[0].group_type).toBe("superset");
    expect(day.groups[0].exercises.map((e) => e.id)).toContain(movedId);
    assertFlatMatchesGroups(1);
  });
});
