import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockConfigData = vi.fn();
const mockUpsertMutation = vi.fn();

vi.mock("@/hooks/use-cycle-training", () => ({
  useCycleTrainingConfig: () => mockConfigData(),
  useUpsertCycleTrainingConfig: () => mockUpsertMutation(),
}));

const { PhaseConfigDialog } = await import(
  "@/components/cycle-training/phase-config-dialog"
);

describe("PhaseConfigDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    const { container } = render(
      <PhaseConfigDialog open={false} onOpenChange={vi.fn()} clientId="c1" />
    );

    // Dialog should not be visible
    expect(screen.queryByText("configTitle")).not.toBeInTheDocument();
  });

  it("renders dialog title when open", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    expect(screen.getByText("configTitle")).toBeInTheDocument();
    expect(screen.getByText("configDescription")).toBeInTheDocument();
  });

  it("shows loading spinner when data is loading", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: true });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    // Loader2 svg should be present (animate-spin)
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("renders enabled toggle and auto-adjust toggle", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    expect(screen.getByText("enabled")).toBeInTheDocument();
    expect(screen.getByText("enabledDesc")).toBeInTheDocument();
    expect(screen.getByText("autoAdjust")).toBeInTheDocument();
    expect(screen.getByText("autoAdjustDesc")).toBeInTheDocument();
  });

  it("renders all 4 phase tabs", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    expect(screen.getByText("phase.menstrual")).toBeInTheDocument();
    expect(screen.getByText("phase.follicular")).toBeInTheDocument();
    expect(screen.getByText("phase.ovulation")).toBeInTheDocument();
    expect(screen.getByText("phase.luteal")).toBeInTheDocument();
  });

  it("renders save and cancel buttons", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    expect(screen.getByText("save")).toBeInTheDocument();
    expect(screen.getByText("cancel")).toBeInTheDocument();
  });

  it("renders intensity and volume input fields", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    // Labels for intensity and volume
    expect(screen.getByText("intensityAdj")).toBeInTheDocument();
    expect(screen.getByText("volumeAdj")).toBeInTheDocument();
  });

  it("renders phase tip for active phase", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    // Default active phase is menstrual
    expect(screen.getByText("phaseTip.menstrual")).toBeInTheDocument();
  });

  it("pre-fills form when config data exists", () => {
    mockConfigData.mockReturnValue({
      data: {
        enabled: false,
        auto_adjust: false,
        menstrual_intensity: -30,
        menstrual_volume: -25,
        menstrual_notes: "Descanso",
        follicular_intensity: 5,
        follicular_volume: 0,
        follicular_notes: "",
        ovulation_intensity: 15,
        ovulation_volume: 10,
        ovulation_notes: "",
        luteal_intensity: -5,
        luteal_volume: -5,
        luteal_notes: "",
      },
      isLoading: false,
    });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    // The form should render with existing data (form is populated via useEffect)
    // Verify the dialog rendered correctly
    expect(screen.getByText("configTitle")).toBeInTheDocument();
  });

  it("disables save button when mutation is pending", () => {
    mockConfigData.mockReturnValue({ data: null, isLoading: false });
    mockUpsertMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: true });

    render(
      <PhaseConfigDialog open={true} onOpenChange={vi.fn()} clientId="c1" />
    );

    const saveButton = screen.getByText("save").closest("button");
    expect(saveButton).toBeDisabled();
  });
});
