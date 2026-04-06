import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockPrivacyData = vi.fn();
const mockUpdateMutation = vi.fn();

vi.mock("@/hooks/use-cycle-training", () => ({
  useCyclePrivacySettings: () => mockPrivacyData(),
  useUpdateCyclePrivacy: () => mockUpdateMutation(),
}));

const { CyclePrivacySettings } = await import(
  "@/components/cycle-training/cycle-privacy-settings"
);

describe("CyclePrivacySettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows skeleton while loading", () => {
    mockPrivacyData.mockReturnValue({ data: null, isLoading: true });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    const { container } = render(<CyclePrivacySettings />);
    // When loading, the component renders a Skeleton instead of the form
    // Privacy title should NOT be rendered
    expect(screen.queryByText("privacyTitle")).not.toBeInTheDocument();
    // Something should be rendered (the skeleton placeholder)
    expect(container.firstChild).toBeTruthy();
  });

  it("renders all privacy toggle fields", () => {
    mockPrivacyData.mockReturnValue({
      data: {
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      },
      isLoading: false,
    });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(<CyclePrivacySettings />);

    // Title
    expect(screen.getByText("privacyTitle")).toBeInTheDocument();

    // All toggle labels (translations return key as-is)
    expect(screen.getByText("anonymousMode")).toBeInTheDocument();
    expect(screen.getByText("sharePhase")).toBeInTheDocument();
    expect(screen.getByText("shareEnergy")).toBeInTheDocument();
    expect(screen.getByText("shareSymptoms")).toBeInTheDocument();
    expect(screen.getByText("shareMood")).toBeInTheDocument();
    expect(screen.getByText("shareFlow")).toBeInTheDocument();
    expect(screen.getByText("sharePredictions")).toBeInTheDocument();
  });

  it("renders save button", () => {
    mockPrivacyData.mockReturnValue({
      data: {
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      },
      isLoading: false,
    });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(<CyclePrivacySettings />);

    expect(screen.getByText("savePrivacy")).toBeInTheDocument();
  });

  it("shows anonymous mode description", () => {
    mockPrivacyData.mockReturnValue({
      data: {
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      },
      isLoading: false,
    });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(<CyclePrivacySettings />);

    expect(screen.getByText("anonymousModeDesc")).toBeInTheDocument();
  });

  it("shows description text for privacy section", () => {
    mockPrivacyData.mockReturnValue({
      data: {
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      },
      isLoading: false,
    });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(<CyclePrivacySettings />);

    expect(screen.getByText("privacyDescription")).toBeInTheDocument();
  });

  it("renders correct number of switch elements", () => {
    mockPrivacyData.mockReturnValue({
      data: {
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      },
      isLoading: false,
    });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    render(<CyclePrivacySettings />);

    // 7 switches: anonymous_mode + 6 share_* fields
    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(7);
  });

  it("disables save button while mutation is pending", () => {
    mockPrivacyData.mockReturnValue({
      data: {
        share_phase: true,
        share_symptoms: false,
        share_mood: false,
        share_flow: false,
        share_energy: true,
        share_predictions: false,
        anonymous_mode: false,
      },
      isLoading: false,
    });
    mockUpdateMutation.mockReturnValue({ mutateAsync: vi.fn(), isPending: true });

    render(<CyclePrivacySettings />);

    const saveButton = screen.getByText("savePrivacy").closest("button");
    expect(saveButton).toBeDisabled();
  });
});
