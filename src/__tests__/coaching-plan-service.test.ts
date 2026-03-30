import { describe, it, expect, vi, beforeEach } from "vitest";

// Build a flexible chain mock that supports any depth of .eq().eq().eq().order() etc.
// The chain is "thenable" so that `await chain` resolves to the resolvedValue.
function createChain(resolvedValue?: unknown) {
  const defaultResolved = resolvedValue ?? { data: [], count: 0, error: null };
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.ilike = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.range = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.maybeSingle = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  // Make the chain thenable so `await chain` resolves
  chain.then = vi.fn().mockImplementation((resolve: (v: unknown) => void) => {
    return Promise.resolve(defaultResolved).then(resolve);
  });
  return chain;
}

const mockGetUser = vi.fn();
let chainForTable: Record<string, ReturnType<typeof createChain>> = {};

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: vi.fn().mockImplementation((table: string) => {
    if (chainForTable[table]) return chainForTable[table];
    return createChain();
  }),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const { coachingPlansService } = await import(
  "@/services/coaching-plans.service"
);

describe("coachingPlansService.getCoachingPlans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("returns plans for authenticated user", async () => {
    const plans = [{ id: "plan-1", name: "12 Week Shred" }];
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain({ data: plans, count: 1, error: null });
    chainForTable["coaching_plans"] = chain;

    const result = await coachingPlansService.getCoachingPlans();

    expect(mockSupabase.from).toHaveBeenCalledWith("coaching_plans");
    expect(result).toEqual({ data: plans, count: 1 });
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      coachingPlansService.getCoachingPlans()
    ).rejects.toThrow("Not authenticated");
  });

  it("applies search filter via ilike", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    // The chain must stay synchronous through .range() so .ilike() can be called on it.
    // Override the thenable to return the desired data.
    const chain = createChain({ data: [], count: 0, error: null });
    chainForTable["coaching_plans"] = chain;

    await coachingPlansService.getCoachingPlans({ search: "shred" });

    expect(mockSupabase.from).toHaveBeenCalledWith("coaching_plans");
    expect(chain.ilike).toHaveBeenCalledWith("name", "%shred%");
  });

  it("throws when supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain({
      data: null,
      count: null,
      error: { message: "Query failed" },
    });
    chainForTable["coaching_plans"] = chain;

    await expect(
      coachingPlansService.getCoachingPlans()
    ).rejects.toThrow();
  });
});

describe("coachingPlansService.createCoachingPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("inserts plan and questionnaire links", async () => {
    const createdPlan = { id: "plan-new", name: "New Plan" };
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "coaching_plans") {
        const chain = createChain();
        chain.single.mockResolvedValue({ data: createdPlan, error: null });
        return chain;
      }
      if (table === "coaching_plan_questionnaires") {
        const chain = createChain();
        chain.insert.mockReturnValue({ error: null });
        return chain;
      }
      return createChain();
    });

    const formData = {
      name: "New Plan",
      description: "Great plan",
      duration_weeks: 8,
      questionnaire_template_ids: [
        "550e8400-e29b-41d4-a716-446655440000",
      ],
      is_active: true,
      is_published: false,
    };

    const result = await coachingPlansService.createCoachingPlan(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith("coaching_plans");
    expect(result).toEqual(createdPlan);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      coachingPlansService.createCoachingPlan({
        name: "Test",
        duration_weeks: 4,
        is_active: true,
        is_published: false,
      })
    ).rejects.toThrow("Not authenticated");
  });
});

describe("coachingPlansService.deleteCoachingPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("deletes from coaching_plans table", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.eq
      .mockReturnValueOnce(chain) // first .eq("id", id)
      .mockResolvedValueOnce({ error: null }); // second .eq("trainer_id")
    chainForTable["coaching_plans"] = chain;

    await coachingPlansService.deleteCoachingPlan("plan-1");

    expect(mockSupabase.from).toHaveBeenCalledWith("coaching_plans");
    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith("id", "plan-1");
    expect(chain.eq).toHaveBeenCalledWith("trainer_id", "trainer-1");
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      coachingPlansService.deleteCoachingPlan("plan-1")
    ).rejects.toThrow("Not authenticated");
  });

  it("throws when supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.eq
      .mockReturnValueOnce(chain)
      .mockResolvedValueOnce({ error: { message: "Not found" } });
    chainForTable["coaching_plans"] = chain;

    await expect(
      coachingPlansService.deleteCoachingPlan("plan-1")
    ).rejects.toThrow();
  });
});

describe("coachingPlansService.getClientCoachingPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("returns active plan for client", async () => {
    const plan = { id: "ccp-1", client_id: "c1", status: "active" };
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.maybeSingle.mockResolvedValue({ data: plan, error: null });
    chainForTable["client_coaching_plans"] = chain;

    const result = await coachingPlansService.getClientCoachingPlan("c1");

    expect(mockSupabase.from).toHaveBeenCalledWith("client_coaching_plans");
    expect(result).toEqual(plan);
  });

  it("returns null when no active plan", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.maybeSingle.mockResolvedValue({ data: null, error: null });
    chainForTable["client_coaching_plans"] = chain;

    const result = await coachingPlansService.getClientCoachingPlan("c1");

    expect(result).toBeNull();
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      coachingPlansService.getClientCoachingPlan("c1")
    ).rejects.toThrow("Not authenticated");
  });
});
