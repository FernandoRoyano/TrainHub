import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock crypto.randomUUID
vi.stubGlobal("crypto", { randomUUID: () => "generated-uuid-token" });

// Build mock Supabase chain
const mockSingle = vi.fn();
const mockUpdate = vi.fn();
const mockUpdateEq = vi.fn();
const mockGetUser = vi.fn();

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(mockSupabase),
}));

const { POST } = await import("@/app/api/generate-invite-link/route");

describe("POST /api/generate-invite-link", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new Request("http://localhost/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "c1" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when clientId not provided", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    const req = new Request("http://localhost/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when client not found", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    });

    const req = new Request("http://localhost/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "nonexistent" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 when client already has an account", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  id: "c1",
                  full_name: "Mary",
                  user_id: "already-registered",
                  invite_token: null,
                },
                error: null,
              }),
          }),
        }),
      }),
    });

    const req = new Request("http://localhost/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "c1" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("reuses existing token when client already has one", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  id: "c1",
                  full_name: "Mary",
                  user_id: null,
                  invite_token: "existing-token",
                },
                error: null,
              }),
          }),
        }),
      }),
    });

    const req = new Request("https://train-hub-five.vercel.app/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "c1" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.link).toContain("existing-token");
    expect(data.link).not.toContain(" ");
  });

  it("generates new token when client has none", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    // First call: select client (no token)
    // Second call: update with new token
    let callCount = 0;
    mockSupabase.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      id: "c1",
                      full_name: "Mary",
                      user_id: null,
                      invite_token: null,
                    },
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }
      return {
        update: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      };
    });

    const req = new Request("https://train-hub-five.vercel.app/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "c1" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.link).toContain("generated-uuid-token");
  });

  it("uses NEXT_PUBLIC_APP_URL when set", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://myapp.com";

    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  id: "c1",
                  full_name: "Mary",
                  user_id: null,
                  invite_token: "token-abc",
                },
                error: null,
              }),
          }),
        }),
      }),
    });

    const req = new Request("http://localhost:3000/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "c1" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.link).toBe("https://myapp.com/join/token-abc");

    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  it("falls back to request origin when NEXT_PUBLIC_APP_URL not set", async () => {
    delete process.env.NEXT_PUBLIC_APP_URL;

    mockGetUser.mockResolvedValue({
      data: { user: { id: "trainer-1" } },
    });

    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  id: "c1",
                  full_name: "Mary",
                  user_id: null,
                  invite_token: "token-abc",
                },
                error: null,
              }),
          }),
        }),
      }),
    });

    const req = new Request("https://train-hub-five.vercel.app/api/generate-invite-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "c1" }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.link).toBe("https://train-hub-five.vercel.app/join/token-abc");
  });
});
