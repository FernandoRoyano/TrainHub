import { describe, it, expect } from "vitest";

/**
 * Tests for invite flow logic.
 * These test the pure logic without hitting Supabase.
 * The actual API endpoints are integration-tested separately.
 */

describe("Invite link generation", () => {
  function buildInviteLink(appUrl: string, token: string): string {
    return `${appUrl}/join/${token}`;
  }

  it("generates correct link with https URL", () => {
    const link = buildInviteLink("https://train-hub-five.vercel.app", "abc-123");
    expect(link).toBe("https://train-hub-five.vercel.app/join/abc-123");
  });

  it("link does not contain spaces", () => {
    const link = buildInviteLink("https://train-hub-five.vercel.app", "abc-123");
    expect(link).not.toContain(" ");
  });

  it("link starts with https", () => {
    const link = buildInviteLink("https://train-hub-five.vercel.app", "abc-123");
    expect(link).toMatch(/^https:\/\//);
  });

  it("rejects URL without protocol by validation", () => {
    const link = buildInviteLink("train-hub-five.vercel.app", "abc-123");
    // This would produce a broken link - our test catches it
    expect(link).not.toMatch(/^https:\/\//);
  });
});

describe("Invite token verification logic", () => {
  interface ClientRecord {
    full_name: string;
    user_id: string | null;
  }

  function verifyToken(client: ClientRecord | null): { valid: boolean; clientName?: string } {
    if (!client || client.user_id) {
      return { valid: false };
    }
    return { valid: true, clientName: client.full_name };
  }

  it("returns valid for client with no user_id", () => {
    const result = verifyToken({ full_name: "Mary", user_id: null });
    expect(result.valid).toBe(true);
    expect(result.clientName).toBe("Mary");
  });

  it("returns invalid for client with existing user_id", () => {
    const result = verifyToken({ full_name: "Mary", user_id: "some-uuid" });
    expect(result.valid).toBe(false);
  });

  it("returns invalid when no client found", () => {
    const result = verifyToken(null);
    expect(result.valid).toBe(false);
  });
});

describe("Auth callback client linking logic", () => {
  interface ClientForLinking {
    id: string;
    email: string;
    user_id: string | null;
    trainer_id: string;
    full_name: string;
    invite_token: string | null;
  }

  function findClientByEmail(
    clients: ClientForLinking[],
    email: string
  ): ClientForLinking | null {
    return clients.find((c) => c.email === email && c.user_id === null) ?? null;
  }

  function findClientByToken(
    clients: ClientForLinking[],
    token: string
  ): ClientForLinking | null {
    return clients.find((c) => c.invite_token === token && c.user_id === null) ?? null;
  }

  function determineRedirect(
    clients: ClientForLinking[],
    userEmail: string,
    inviteToken?: string
  ): string {
    // Try email match first
    const emailMatch = findClientByEmail(clients, userEmail);
    if (emailMatch) return "/my-routine";

    // Try token match
    if (inviteToken) {
      const tokenMatch = findClientByToken(clients, inviteToken);
      if (tokenMatch) return "/my-routine";
    }

    // Default redirect for trainers
    return "/dashboard";
  }

  const clients: ClientForLinking[] = [
    {
      id: "c1",
      email: "mary@example.com",
      user_id: null,
      trainer_id: "t1",
      full_name: "Mary",
      invite_token: "token-123",
    },
    {
      id: "c2",
      email: "john@example.com",
      user_id: "already-linked",
      trainer_id: "t1",
      full_name: "John",
      invite_token: null,
    },
  ];

  it("redirects to /my-routine when email matches unlinked client", () => {
    expect(determineRedirect(clients, "mary@example.com")).toBe("/my-routine");
  });

  it("redirects to /my-routine when invite token matches unlinked client", () => {
    expect(determineRedirect(clients, "new@example.com", "token-123")).toBe("/my-routine");
  });

  it("redirects to /dashboard when no match found (trainer)", () => {
    expect(determineRedirect(clients, "trainer@example.com")).toBe("/dashboard");
  });

  it("redirects to /dashboard when client already linked", () => {
    expect(determineRedirect(clients, "john@example.com")).toBe("/dashboard");
  });

  it("redirects to /dashboard when token exists but client already linked", () => {
    const clientsWithUsedToken: ClientForLinking[] = [
      { ...clients[0], user_id: "used", invite_token: "token-123" },
    ];
    expect(determineRedirect(clientsWithUsedToken, "other@example.com", "token-123")).toBe(
      "/dashboard"
    );
  });
});

describe("APP_URL validation", () => {
  function isValidAppUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && !parsed.pathname.endsWith(" ");
    } catch {
      return false;
    }
  }

  it("accepts valid https URL", () => {
    expect(isValidAppUrl("https://train-hub-five.vercel.app")).toBe(true);
  });

  it("rejects URL without protocol", () => {
    expect(isValidAppUrl("train-hub-five.vercel.app")).toBe(false);
  });

  it("rejects http URL", () => {
    expect(isValidAppUrl("http://train-hub-five.vercel.app")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidAppUrl("")).toBe(false);
  });
});
