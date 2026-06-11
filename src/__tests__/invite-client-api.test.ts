import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock crypto.randomUUID
vi.stubGlobal("crypto", { randomUUID: () => "generated-uuid-token" });

// Mock Supabase
const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
const mockGetUser = vi.fn();

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(mockSupabase),
}));

// Mock gmail-smtp
const mockSendGmail = vi.fn();
vi.mock("@/lib/email/gmail-smtp", () => ({
  sendGmail: (...args: unknown[]) => mockSendGmail(...args),
}));

// Mock email translations
vi.mock("@/lib/email/translations", () => ({
  getEmailTranslations: () => ({
    inviteSubject: "{trainer} invites you to TrainHub",
    inviteTitle: "Hi {name}!",
    inviteBody: "Your trainer {trainer} has invited you.",
    inviteCta: "Create my account",
    inviteFooter: "If you were not expecting this email, ignore it.",
  }),
  getLocaleForEmail: () => "es",
}));

const { POST } = await import("@/app/api/invite-client/route");

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/invite-client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Helper to set up "from" mock chain for different tables
function setupFromMock(clientData: Record<string, unknown> | null, clientError: unknown, trainerData?: Record<string, unknown> | null) {
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === "clients") {
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: clientData, error: clientError }),
            }),
          }),
        }),
        update: () => ({
          eq: mockUpdateEq,
        }),
      };
    }
    if (table === "users") {
      return {
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: trainerData ?? { full_name: "Coach Mike" },
                error: null,
              }),
          }),
        }),
      };
    }
    return {};
  });
}

describe("POST /api/invite-client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "https://trainhub.app";
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when clientId is missing", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });

    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("clientId required");
  });

  it("returns 404 when client not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });
    setupFromMock(null, { message: "Not found" });

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(404);
  });

  it("returns 400 when client has no email", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });
    setupFromMock(
      { id: "c1", email: null, full_name: "John", user_id: null, invite_token: null },
      null
    );

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Client has no email");
  });

  it("returns 400 when client already has an account", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });
    setupFromMock(
      { id: "c1", email: "john@test.com", full_name: "John", user_id: "u1", invite_token: null },
      null
    );

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Client already has an account");
  });

  it("sends email and returns success when everything is valid", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });
    setupFromMock(
      { id: "c1", email: "john@test.com", full_name: "John", user_id: null, invite_token: "existing-token" },
      null,
      { full_name: "Coach Mike" }
    );
    mockSendGmail.mockResolvedValue({ success: true });

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("calls sendGmail with client email and trainer name in subject", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });
    setupFromMock(
      { id: "c1", email: "john@test.com", full_name: "John", user_id: null, invite_token: "tok-1" },
      null,
      { full_name: "Coach Mike" }
    );
    mockSendGmail.mockResolvedValue({ success: true });

    await POST(makeRequest({ clientId: "c1" }));

    expect(mockSendGmail).toHaveBeenCalledTimes(1);
    const callArgs = mockSendGmail.mock.calls[0][0];
    expect(callArgs.to).toBe("john@test.com");
    expect(callArgs.subject).toContain("Coach Mike");
  });

  it("returns 500 when email sending fails", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "t1" } } });
    setupFromMock(
      { id: "c1", email: "john@test.com", full_name: "John", user_id: null, invite_token: "tok-1" },
      null,
      { full_name: "Coach Mike" }
    );
    mockSendGmail.mockResolvedValue({ success: false, error: new Error("SMTP failed") });

    const res = await POST(makeRequest({ clientId: "c1" }));
    expect(res.status).toBe(500);
  });
});
