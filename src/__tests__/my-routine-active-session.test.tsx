import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  logs: [] as Array<Record<string, unknown>>,
  sessionEnd: vi.fn(),
  sessionStart: vi.fn(),
  completeMutate: vi.fn(),
  store: {
    activeWorkoutId: "workout-today" as string | null,
    workoutStartedAt: "2026-09-30T08:00:00.000Z" as string | null,
    exerciseData: {},
    workoutNotes: "",
    loggedExercises: [] as string[],
    selectedDayIndex: 0,
    startSession: vi.fn(),
    endSession: vi.fn(),
    setExerciseData: vi.fn(),
    setWorkoutNotes: vi.fn(),
    markExerciseLogged: vi.fn(),
    setSelectedDayIndex: vi.fn(),
  },
}));

vi.mock("@/components/shared/feature-gate", () => ({
  FeatureGate: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/workout/workout-timer", () => ({
  WorkoutTimer: () => <span>00:42</span>,
}));

vi.mock("@/components/workout/rest-timer", () => ({ RestTimer: () => null }));
vi.mock("@/components/workout/exercise-detail-dialog", () => ({ ExerciseDetailDialog: () => null }));
vi.mock("@/components/cycle-training/adaptive-training-card", () => ({ AdaptiveTrainingCard: () => null }));

vi.mock("@/lib/local-date", () => ({ localDateString: () => "2026-09-30" }));

vi.mock("@/hooks/use-weight-unit", () => ({
  useWeightUnit: () => ({
    unit: "kg",
    toStoredKg: (value: string) => Number(value),
    format: (value: number) => `${value} kg`,
  }),
}));

vi.mock("@/stores/rest-timer-store", () => ({
  useRestTimerStore: (selector: (state: { startCountdown: () => void }) => unknown) =>
    selector({ startCountdown: vi.fn() }),
}));

vi.mock("@/stores/workout-session-store", () => ({
  useWorkoutSessionStore: (selector: (state: typeof mocks.store) => unknown) => selector(mocks.store),
}));

vi.mock("@/hooks/use-client-app", () => ({
  useMyRoutine: () => ({
    data: {
      id: "assignment-1",
      client_id: "client-1",
      routine_id: "routine-1",
      start_date: "2026-09-01",
      end_date: null,
      status: "active",
      routine: {
        id: "routine-1",
        name: "Rutina de prueba",
        days: [{
          id: "day-1",
          routine_id: "routine-1",
          day_number: 1,
          name: "Día 1",
          description: null,
          exercises: [],
        }],
      },
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    isRefetching: false,
  }),
  useMyRoutineRealtime: vi.fn(),
  useMyClient: () => ({ data: { id: "client-1", gender: "male" } }),
  useWorkoutLogs: () => ({ data: mocks.logs }),
  useStartWorkout: () => ({ isPending: false, mutate: vi.fn() }),
  useCompleteWorkout: () => ({ isPending: false, mutate: mocks.completeMutate }),
  useLogExercise: () => ({ isPending: false, mutate: vi.fn() }),
}));

import MyRoutinePage from "@/app/[locale]/(client)/my-routine/page";

describe("active workout controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.store.activeWorkoutId = "workout-today";
    mocks.store.endSession = mocks.sessionEnd;
    mocks.store.startSession = mocks.sessionStart;
    mocks.logs = [{
      id: "workout-today",
      client_id: "client-1",
      client_routine_id: "assignment-1",
      routine_day_id: "day-1",
      date: "2026-09-30",
      completed: false,
      started_at: "2026-09-30T08:00:00.000Z",
      exercise_logs: [],
    }];
  });

  it("keeps the active session compact until the user asks to complete it", () => {
    const { container } = render(<MyRoutinePage />);

    const completeButton = screen.getByRole("button", { name: "completeWorkout" });
    const activeBar = completeButton.closest(".sticky");

    expect(activeBar).toHaveClass("flex");
    expect(activeBar).not.toHaveClass("space-y-3");
    expect(screen.queryByPlaceholderText("workoutNotesPlaceholder")).not.toBeInTheDocument();
    expect(container.querySelector('input[type="date"]')).not.toBeInTheDocument();

    fireEvent.click(completeButton);

    expect(screen.getByPlaceholderText("workoutNotesPlaceholder")).toBeVisible();
    expect(container.ownerDocument.querySelector('input[type="date"]')).toBeVisible();
  });

  it("clears a persisted workout from another date", async () => {
    mocks.store.activeWorkoutId = "workout-yesterday";
    mocks.logs = [{
      ...mocks.logs[0],
      id: "workout-yesterday",
      date: "2026-09-29",
    }];

    render(<MyRoutinePage />);

    await waitFor(() => expect(mocks.sessionEnd).toHaveBeenCalledOnce());
    expect(mocks.sessionStart).not.toHaveBeenCalled();
  });
});
