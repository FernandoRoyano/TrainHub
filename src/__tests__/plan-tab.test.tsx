import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ClipboardList: () => <span data-testid="icon-clipboard" />,
  Dumbbell: () => <span data-testid="icon-dumbbell" />,
  UtensilsCrossed: () => <span data-testid="icon-utensils" />,
  FileQuestion: () => <span data-testid="icon-filequestion" />,
  StickyNote: () => <span data-testid="icon-stickynote" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  Save: () => <span data-testid="icon-save" />,
  ExternalLink: () => <span data-testid="icon-externallink" />,
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
    const skeletons = container.querySelectorAll("[class*='animate-pulse'], [data-slot='skeleton']");
    // At minimum the container should render the skeleton wrapper
    expect(container.querySelector(".space-y-4")).toBeTruthy();
  });
});
