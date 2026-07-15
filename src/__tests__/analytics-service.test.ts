import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockGte = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: { id: "trainer-1" } },
        }),
      getSession: () =>
        Promise.resolve({
          data: { session: { user: { id: "trainer-1" } } },
        }),
    },
    from: mockFrom,
  }),
}));

// Chain mock
mockFrom.mockReturnValue({
  select: mockSelect.mockReturnValue({
    eq: mockEq.mockReturnValue({
      gte: mockGte.mockReturnValue({
        order: mockOrder.mockReturnValue({
          limit: mockLimit.mockReturnValue(
            Promise.resolve({ data: [], error: null })
          ),
          then: (fn: (v: unknown) => void) => fn({ data: [], error: null }),
        }),
        then: (fn: (v: unknown) => void) => fn({ data: [], error: null }),
      }),
      then: (fn: (v: unknown) => void) => fn({ data: [], error: null }),
    }),
    gte: mockGte,
    then: (fn: (v: unknown) => void) => fn({ data: [], error: null }),
  }),
});

describe("analyticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be importable", async () => {
    const { analyticsService } = await import("@/services/analytics.service");
    expect(analyticsService).toBeDefined();
    expect(typeof analyticsService.getAnalytics).toBe("function");
  });
});
