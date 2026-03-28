import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase server client
const mockSingle = vi.fn();
const mockGetUser = vi.fn();
const mockFromSelect = vi.fn();

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: vi.fn().mockImplementation(() => ({
    select: (...args: unknown[]) => ({
      eq: (...eqArgs: unknown[]) => ({
        eq: (...eqArgs2: unknown[]) => ({
          single: mockSingle,
        }),
      }),
    }),
  })),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(mockSupabase),
}));

// Mock Supabase admin client
const mockUpdateUserById = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    auth: {
      admin: {
        updateUserById: mockUpdateUserById,
      },
    },
  }),
}));

const { POST } = await import("@/app/api/reset-client-password/route");

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/reset-client-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/reset-client-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(makeRequest({ clientId: "c1", newPassword: "abc123" }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Not authenticated");
  });

  it("returns 400 when clientId is missing", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const res = await POST(makeRequest({ newPassword: "abc123" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("clientId and newPassword required");
  });

  it("returns 400 when newPassword is missing", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });

    const res = await POST(makeRequest({ clientId: "c1", newPassword: "abc" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Password must be at least 6 characters");
  });

  it("returns 404 when client not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockSingle.mockResolvedValue({ data: null, error: { message: "Not found" } });

    const res = await POST(makeRequest({ clientId: "c1", newPassword: "abc123" }));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Client not found");
  });

  it("returns 400 when client has no linked account (no user_id)", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockSingle.mockResolvedValue({
      data: { id: "c1", user_id: null, full_name: "John" },
      error: null,
    });

    const res = await POST(makeRequest({ clientId: "c1", newPassword: "abc123" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Client has no linked account");
  });

  it("returns 500 when admin updateUserById fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockSingle.mockResolvedValue({
      data: { id: "c1", user_id: "user-1", full_name: "John" },
      error: null,
    });
    mockUpdateUserById.mockResolvedValue({
      error: { message: "Admin API error" },
    });

    const res = await POST(makeRequest({ clientId: "c1", newPassword: "newpass123" }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Admin API error");
  });

  it("returns success when password is updated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockSingle.mockResolvedValue({
      data: { id: "c1", user_id: "user-1", full_name: "John" },
      error: null,
    });
    mockUpdateUserById.mockResolvedValue({ error: null });

    const res = await POST(makeRequest({ clientId: "c1", newPassword: "newpass123" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("calls updateUserById with the correct user_id and password", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockSingle.mockResolvedValue({
      data: { id: "c1", user_id: "user-abc", full_name: "John" },
      error: null,
    });
    mockUpdateUserById.mockResolvedValue({ error: null });

    await POST(makeRequest({ clientId: "c1", newPassword: "secure123" }));

    expect(mockUpdateUserById).toHaveBeenCalledWith("user-abc", {
      password: "secure123",
    });
  });
});
