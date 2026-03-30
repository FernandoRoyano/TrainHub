import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();

// Auth supabase (server)
const mockAuthSupabase = {
  auth: {
    getUser: mockGetUser,
  },
};

// Build a flexible admin mock that tracks table calls
// and returns chainable objects for any depth
function createChain(resolvedValue?: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.maybeSingle = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  return chain;
}

// Table-specific resolved values
let tableResults: Record<string, unknown> = {};
const tableCalls: string[] = [];

const mockAdminSupabase = {
  from: vi.fn().mockImplementation((table: string) => {
    tableCalls.push(table);
    const resolved = tableResults[table];
    return createChain(resolved);
  }),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(mockAuthSupabase),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => mockAdminSupabase,
}));

// Must import after mocks
const { POST } = await import(
  "@/app/api/coaching-plans/assign/route"
);

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/coaching-plans/assign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/coaching-plans/assign", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tableCalls.length = 0;
    tableResults = {};
    mockAdminSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      const resolved = tableResults[table];
      return createChain(resolved);
    });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await POST(
      makeRequest({
        client_id: "c1",
        coaching_plan_id: "plan-1",
        start_date: "2024-06-01",
      })
    );

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 400 when missing required fields", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const response = await POST(
      makeRequest({
        client_id: "c1",
        // missing coaching_plan_id and start_date
      })
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Missing required fields");
  });

  it("returns 400 when coaching_plan_id is missing", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const response = await POST(
      makeRequest({
        client_id: "c1",
        start_date: "2024-06-01",
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 when start_date is missing", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const response = await POST(
      makeRequest({
        client_id: "c1",
        coaching_plan_id: "plan-1",
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 when plan not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    tableResults["coaching_plans"] = {
      data: null,
      error: { message: "Not found" },
    };

    const response = await POST(
      makeRequest({
        client_id: "c1",
        coaching_plan_id: "non-existent",
        start_date: "2024-06-01",
      })
    );

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Coaching plan not found");
  });

  it("creates all resources on valid assignment", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    // Setup table results
    const plan = {
      id: "plan-1",
      name: "Full Plan",
      trainer_id: "trainer-1",
      duration_weeks: 8,
      routine_template_id: "routine-t1",
      meal_plan_template_id: "meal-t1",
      service_tier_id: "tier-1",
    };

    // For coaching_plans we need `.single()` to return the plan on first call
    // and for coaching_plan_questionnaires we need select/eq to return links.
    // Use a counter-based from mock.
    let callIndex = 0;
    mockAdminSupabase.from.mockImplementation((table: string) => {
      tableCalls.push(table);
      callIndex++;

      if (table === "coaching_plans" && callIndex === 1) {
        return createChain({ data: plan, error: null });
      }
      if (table === "coaching_plan_questionnaires") {
        const chain = createChain();
        // Override eq to resolve with questionnaire links
        chain.eq.mockResolvedValue({
          data: [
            { questionnaire_template_id: "qt-1" },
            { questionnaire_template_id: "qt-2" },
          ],
          error: null,
        });
        return chain;
      }
      if (table === "client_routines") {
        return createChain({ data: { id: "cr-1" }, error: null });
      }
      if (table === "client_meal_plans") {
        return createChain({ data: { id: "cmp-1" }, error: null });
      }
      if (table === "client_service_tiers") {
        return createChain({ data: { id: "cst-1" }, error: null });
      }
      if (table === "client_questionnaires") {
        return createChain({ data: {}, error: null });
      }
      if (table === "client_coaching_plans") {
        return createChain({
          data: {
            id: "ccp-1",
            client_id: "c1",
            coaching_plan_id: "plan-1",
            status: "active",
          },
          error: null,
        });
      }
      if (table === "clients") {
        return createChain({ data: null, error: null });
      }
      return createChain();
    });

    const response = await POST(
      makeRequest({
        client_id: "c1",
        coaching_plan_id: "plan-1",
        start_date: "2024-06-01",
        notes: "Starting today",
      })
    );

    const data = await response.json();

    // Verify the API was called with all expected tables
    expect(tableCalls).toContain("coaching_plans");
    expect(tableCalls).toContain("coaching_plan_questionnaires");
    expect(tableCalls).toContain("client_routines");
    expect(tableCalls).toContain("client_meal_plans");
    expect(tableCalls).toContain("client_service_tiers");
    expect(tableCalls).toContain("client_questionnaires");
    expect(tableCalls).toContain("client_coaching_plans");
    expect(tableCalls).toContain("clients");

    // Verify response
    expect(data.data).toBeDefined();
    expect(data.data.id).toBe("ccp-1");
    expect(data.data.status).toBe("active");
  });
});
