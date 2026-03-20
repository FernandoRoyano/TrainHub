import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the admin client used by verify-invite
const mockMaybeSingle = vi.fn();
const mockEq = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: mockFrom }),
}));

// Import the handler after mocking
const { GET } = await import("@/app/api/verify-invite/route");

describe("GET /api/verify-invite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset chain
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
  });

  it("returns { valid: false } when no token provided", async () => {
    const req = new Request("http://localhost/api/verify-invite");
    const res = await GET(req);
    const data = await res.json();

    expect(data.valid).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns { valid: true, clientName } for valid unlinked token", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { full_name: "Mary", user_id: null },
    });

    const req = new Request("http://localhost/api/verify-invite?token=abc-123");
    const res = await GET(req);
    const data = await res.json();

    expect(data.valid).toBe(true);
    expect(data.clientName).toBe("Mary");
    expect(mockFrom).toHaveBeenCalledWith("clients");
    expect(mockSelect).toHaveBeenCalledWith("full_name, user_id");
  });

  it("returns { valid: false } when client already has user_id", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { full_name: "Mary", user_id: "existing-user-id" },
    });

    const req = new Request("http://localhost/api/verify-invite?token=abc-123");
    const res = await GET(req);
    const data = await res.json();

    expect(data.valid).toBe(false);
  });

  it("returns { valid: false } when token not found", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });

    const req = new Request("http://localhost/api/verify-invite?token=nonexistent");
    const res = await GET(req);
    const data = await res.json();

    expect(data.valid).toBe(false);
  });
});
