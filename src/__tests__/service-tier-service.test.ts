import { describe, it, expect, vi, beforeEach } from "vitest";

// Build a flexible chain mock that supports any depth of chaining
function createChain(resolvedValue?: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockResolvedValue(resolvedValue ?? { data: [], error: null });
  chain.single = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.maybeSingle = vi.fn().mockResolvedValue(resolvedValue ?? { data: null, error: null });
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

const { serviceTiersService } = await import(
  "@/services/service-tiers.service"
);

const validFeatures = {
  training: true,
  nutrition: true,
  messaging: true,
  progress_tracking: false,
  measurements: false,
  checkins: true,
  questionnaires: false,
};

describe("serviceTiersService.getServiceTiers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("returns tiers for authenticated user", async () => {
    const tiers = [{ id: "tier-1", name: "Pro", trainer_id: "trainer-1" }];
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.order.mockResolvedValue({ data: tiers, error: null });
    chainForTable["service_tiers"] = chain;

    const result = await serviceTiersService.getServiceTiers();

    expect(mockSupabase.from).toHaveBeenCalledWith("service_tiers");
    expect(chain.select).toHaveBeenCalledWith("*");
    expect(result).toEqual(tiers);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(serviceTiersService.getServiceTiers()).rejects.toThrow(
      "Not authenticated"
    );
  });

  it("throws when supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.order.mockResolvedValue({
      data: null,
      error: { message: "Query failed" },
    });
    chainForTable["service_tiers"] = chain;

    await expect(serviceTiersService.getServiceTiers()).rejects.toThrow();
  });
});

describe("serviceTiersService.createServiceTier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("inserts tier with correct data", async () => {
    const createdTier = { id: "tier-new", name: "Elite" };
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.single.mockResolvedValue({ data: createdTier, error: null });
    chainForTable["service_tiers"] = chain;

    const formData = {
      name: "Elite",
      description: "Top tier",
      color: "#ff0000",
      price: 99,
      currency: "USD",
      billing_interval: "monthly" as const,
      features: validFeatures,
      max_revisions_per_month: 10,
      is_active: true,
    };

    const result = await serviceTiersService.createServiceTier(formData);

    expect(mockSupabase.from).toHaveBeenCalledWith("service_tiers");
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        trainer_id: "trainer-1",
        name: "Elite",
        features: validFeatures,
      })
    );
    expect(result).toEqual(createdTier);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      serviceTiersService.createServiceTier({
        name: "Test",
        features: validFeatures,
        is_active: true,
      })
    ).rejects.toThrow("Not authenticated");
  });
});

describe("serviceTiersService.assignTierToClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("inserts assignment and updates client", async () => {
    const assignment = {
      id: "cst-1",
      client_id: "c1",
      service_tier_id: "tier-1",
    };
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "client_service_tiers") {
        const chain = createChain();
        chain.single.mockResolvedValue({ data: assignment, error: null });
        return chain;
      }
      if (table === "clients") {
        const chain = createChain();
        chain.eq.mockResolvedValue({ error: null });
        return chain;
      }
      return createChain();
    });

    const result = await serviceTiersService.assignTierToClient({
      client_id: "c1",
      service_tier_id: "tier-1",
      start_date: "2024-01-01",
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("client_service_tiers");
    expect(mockSupabase.from).toHaveBeenCalledWith("clients");
    expect(result).toEqual(assignment);
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      serviceTiersService.assignTierToClient({
        client_id: "c1",
        service_tier_id: "tier-1",
      })
    ).rejects.toThrow("Not authenticated");
  });
});

describe("serviceTiersService.removeClientTier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainForTable = {};
    mockSupabase.from.mockImplementation((table: string) => {
      if (chainForTable[table]) return chainForTable[table];
      return createChain();
    });
  });

  it("sets active_service_tier_id to null", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const chain = createChain();
    chain.eq.mockResolvedValue({ error: null });
    chainForTable["clients"] = chain;

    await serviceTiersService.removeClientTier("c1");

    expect(mockSupabase.from).toHaveBeenCalledWith("clients");
    expect(chain.update).toHaveBeenCalledWith({
      active_service_tier_id: null,
    });
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      serviceTiersService.removeClientTier("c1")
    ).rejects.toThrow("Not authenticated");
  });
});
