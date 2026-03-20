import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock admin client
const mockAdminFrom = vi.fn();
const mockAdminClient = { from: mockAdminFrom };

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => mockAdminClient,
}));

// Mock email sending
vi.mock("@/lib/email/send-email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/email/templates/welcome", () => ({
  WelcomeEmail: vi.fn().mockReturnValue(null),
}));
vi.mock("@/lib/email/translations", () => ({
  getLocaleForEmail: () => "es",
  getEmailTranslations: () => ({
    welcomeSubject: "Bienvenido",
  }),
}));

// Mock Supabase server client
const mockExchangeCodeForSession = vi.fn();
const mockGetUser = vi.fn();
const mockServerFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () =>
    Promise.resolve({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
        getUser: mockGetUser,
      },
      from: mockServerFrom,
    }),
}));

const { GET } = await import("@/app/auth/callback/route");

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when no code provided", async () => {
    const req = new Request("http://localhost/auth/callback");
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/login");
  });

  it("redirects to /login when code exchange fails", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: { message: "invalid code" },
    });

    const req = new Request("http://localhost/auth/callback?code=invalid");
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/login");
  });

  it("redirects client to /my-routine when email matches unlinked client", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "mary@example.com", user_metadata: {} } },
    });

    // Admin client: find client by email
    mockAdminFrom.mockImplementation((table: string) => {
      if (table === "clients") {
        return {
          select: () => ({
            eq: () => ({
              is: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: { id: "c1", user_id: null, trainer_id: "t1", full_name: "Mary" },
                  }),
              }),
            }),
          }),
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
      if (table === "users") {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { full_name: "Trainer" } }),
            }),
          }),
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
    });

    const req = new Request("http://localhost/auth/callback?code=valid-code");
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/my-routine");
  });

  it("redirects client to /my-routine when invite_token matches", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-2",
          email: "newclient@example.com",
          user_metadata: { invite_token: "token-xyz" },
        },
      },
    });

    // Admin client: no email match, but token match
    let fromCallCount = 0;
    mockAdminFrom.mockImplementation((table: string) => {
      if (table === "clients") {
        fromCallCount++;
        if (fromCallCount === 1) {
          // Email match attempt - returns null
          return {
            select: () => ({
              eq: () => ({
                is: () => ({
                  maybeSingle: () => Promise.resolve({ data: null }),
                }),
              }),
            }),
          };
        }
        if (fromCallCount === 2) {
          // Token match attempt - returns client
          return {
            select: () => ({
              eq: () => ({
                is: () => ({
                  maybeSingle: () =>
                    Promise.resolve({
                      data: { id: "c2", trainer_id: "t1", full_name: "New Client" },
                    }),
                }),
              }),
            }),
          };
        }
        // Update call
        return {
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
      if (table === "users") {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { full_name: "Trainer" } }),
            }),
          }),
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
    });

    const req = new Request("http://localhost/auth/callback?code=valid-code");
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/my-routine");
  });

  it("redirects trainer to /dashboard when no client match", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-3",
          email: "trainer@example.com",
          user_metadata: {},
        },
      },
    });

    mockAdminFrom.mockImplementation((table: string) => {
      if (table === "clients") {
        return {
          select: () => ({
            eq: () => ({
              is: () => ({
                maybeSingle: () => Promise.resolve({ data: null }),
              }),
            }),
          }),
        };
      }
    });

    const req = new Request("http://localhost/auth/callback?code=valid-code");
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/dashboard");
  });

  it("uses admin client instead of user client for RLS bypass", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: "user-1", email: "mary@example.com", user_metadata: {} },
      },
    });

    mockAdminFrom.mockImplementation((table: string) => {
      if (table === "clients") {
        return {
          select: () => ({
            eq: () => ({
              is: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: { id: "c1", user_id: null, trainer_id: "t1", full_name: "Mary" },
                  }),
              }),
            }),
          }),
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
      if (table === "users") {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { full_name: "Trainer" } }),
            }),
          }),
          update: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
    });

    const req = new Request("http://localhost/auth/callback?code=valid");
    await GET(req);

    // Verify admin client was used (not the server client)
    expect(mockAdminFrom).toHaveBeenCalledWith("clients");
    expect(mockAdminFrom).toHaveBeenCalledWith("users");
    // Server client's from should NOT have been called for client linking
    expect(mockServerFrom).not.toHaveBeenCalled();
  });
});
