import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock cycle hooks
const mockCycleInfo = vi.fn();
const mockTrainingSuggestion = vi.fn();

vi.mock("@/hooks/use-menstrual", () => ({
  useCycleInfo: () => mockCycleInfo(),
}));

vi.mock("@/hooks/use-cycle-training", () => ({
  useTrainingSuggestion: () => mockTrainingSuggestion(),
}));

const { AdaptiveTrainingCard } = await import(
  "@/components/cycle-training/adaptive-training-card"
);

describe("AdaptiveTrainingCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when cycle info is loading", () => {
    mockCycleInfo.mockReturnValue({ data: null, isLoading: true });
    mockTrainingSuggestion.mockReturnValue({ data: null, isLoading: true });

    const { container } = render(<AdaptiveTrainingCard />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when no cycle info available", () => {
    mockCycleInfo.mockReturnValue({ data: null, isLoading: false });
    mockTrainingSuggestion.mockReturnValue({ data: null, isLoading: false });

    const { container } = render(<AdaptiveTrainingCard />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when no suggestion available", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "follicular", cycleDay: 8 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({ data: null, isLoading: false });

    const { container } = render(<AdaptiveTrainingCard />);
    expect(container.innerHTML).toBe("");
  });

  it("renders phase name and cycle day when suggestion exists", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "follicular", cycleDay: 8 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({
      data: {
        phase: "follicular",
        cycleDay: 8,
        intensityMod: 5,
        volumeMod: 0,
        trainerNotes: null,
        autoSuggestions: [],
      },
      isLoading: false,
    });

    render(<AdaptiveTrainingCard />);

    expect(screen.getByText("phase.follicular")).toBeInTheDocument();
    expect(screen.getByText(/cycleDay/)).toBeInTheDocument();
  });

  it("renders intensity badge with positive modifier", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "ovulation", cycleDay: 14 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({
      data: {
        phase: "ovulation",
        cycleDay: 14,
        intensityMod: 10,
        volumeMod: 5,
        trainerNotes: null,
        autoSuggestions: [],
      },
      isLoading: false,
    });

    render(<AdaptiveTrainingCard />);

    expect(screen.getByText(/\+10%/)).toBeInTheDocument();
    expect(screen.getByText(/\+5%/)).toBeInTheDocument();
  });

  it("renders intensity badge with negative modifier", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "menstrual", cycleDay: 2 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({
      data: {
        phase: "menstrual",
        cycleDay: 2,
        intensityMod: -20,
        volumeMod: -15,
        trainerNotes: null,
        autoSuggestions: [],
      },
      isLoading: false,
    });

    render(<AdaptiveTrainingCard />);

    expect(screen.getByText(/-20%/)).toBeInTheDocument();
    expect(screen.getByText(/-15%/)).toBeInTheDocument();
  });

  it("renders trainer notes when present", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "menstrual", cycleDay: 3 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({
      data: {
        phase: "menstrual",
        cycleDay: 3,
        intensityMod: -20,
        volumeMod: -15,
        trainerNotes: "Prioriza yoga y estiramientos",
        autoSuggestions: [],
      },
      isLoading: false,
    });

    render(<AdaptiveTrainingCard />);

    expect(screen.getByText("Prioriza yoga y estiramientos")).toBeInTheDocument();
  });

  it("renders auto-suggestions when symptoms present", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "menstrual", cycleDay: 2 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({
      data: {
        phase: "menstrual",
        cycleDay: 2,
        intensityMod: -35,
        volumeMod: -15,
        trainerNotes: null,
        autoSuggestions: [
          "cycleTraining.suggestion.cramps",
          "cycleTraining.suggestion.fatigue",
        ],
      },
      isLoading: false,
    });

    render(<AdaptiveTrainingCard />);

    // Translations return the key, so we check for the key
    expect(screen.getByText("suggestion.cramps")).toBeInTheDocument();
    expect(screen.getByText("suggestion.fatigue")).toBeInTheDocument();
  });

  it("does not render volume badge when volumeMod is 0", () => {
    mockCycleInfo.mockReturnValue({
      data: { currentPhase: "follicular", cycleDay: 10 },
      isLoading: false,
    });
    mockTrainingSuggestion.mockReturnValue({
      data: {
        phase: "follicular",
        cycleDay: 10,
        intensityMod: 5,
        volumeMod: 0,
        trainerNotes: null,
        autoSuggestions: [],
      },
      isLoading: false,
    });

    render(<AdaptiveTrainingCard />);

    // Intensity badge exists
    expect(screen.getByText(/\+5%/)).toBeInTheDocument();
    // Volume badge with 0% should not appear (queryByText returns null)
    expect(screen.queryByText(/0% volume/)).not.toBeInTheDocument();
  });
});
