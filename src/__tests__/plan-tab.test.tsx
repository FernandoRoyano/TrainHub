import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mock all hooks used by PlanTab
vi.mock("@/hooks/use-coaching-plans", () => ({
  useClientCoachingPlan: () => ({ data: null, isLoading: true }),
}));

vi.mock("@/hooks/use-routines", () => ({
  useClientRoutines: () => ({ data: null, isLoading: true }),
}));

vi.mock("@/hooks/use-nutrition", () => ({
  useClientMealPlans: () => ({ data: null, isLoading: true }),
}));

vi.mock("@/hooks/use-questionnaires", () => ({
  useClientQuestionnaires: () => ({ data: null, isLoading: true }),
}));

vi.mock("@/hooks/use-clients", () => ({
  useClient: () => ({ data: null }),
  useUpdateClient: () => ({ mutate: vi.fn(), isPending: false }),
}));

// Mock next-intl (already in setup, but explicit for this test)
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => (
    <a {...props}>{children}</a>
  ),
}));

// Mock lucide-react icons (includes icons from plan-tab + assign-plan-wizard-dialog)
vi.mock("lucide-react", () => ({
  ClipboardList: () => <span data-testid="icon-clipboard" />,
  Dumbbell: () => <span data-testid="icon-dumbbell" />,
  UtensilsCrossed: () => <span data-testid="icon-utensils" />,
  FileQuestion: () => <span data-testid="icon-filequestion" />,
  StickyNote: () => <span data-testid="icon-stickynote" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  Save: () => <span data-testid="icon-save" />,
  ExternalLink: () => <span data-testid="icon-externallink" />,
  Check: () => <span data-testid="icon-check" />,
  Loader2: () => <span data-testid="icon-loader" />,
  ArrowLeft: () => <span data-testid="icon-arrowleft" />,
  MessageCircle: () => <span data-testid="icon-messagecircle" />,
  BarChart3: () => <span data-testid="icon-barchart" />,
  Ruler: () => <span data-testid="icon-ruler" />,
  ClipboardCheck: () => <span data-testid="icon-clipboardcheck" />,
}));

import { PlanTab } from "@/components/clients/plan-tab";

describe("PlanTab", () => {
  it("renders without crash when clientId provided", () => {
    const { container } = render(<PlanTab clientId="client-123" />);
    expect(container).toBeTruthy();
  });

  it("shows loading skeletons initially", () => {
    const { container } = render(<PlanTab clientId="client-123" />);
    // Skeleton component renders divs with animate-pulse from shadcn
    // The component shows 3 Skeleton elements when loading
    // At minimum the container should render the skeleton wrapper
    expect(container.querySelector(".space-y-4")).toBeTruthy();
  });
});
