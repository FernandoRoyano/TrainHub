import { describe, it, expect } from "vitest";

/**
 * Tests for messaging logic.
 * Verifies conversation access control and message ordering.
 */

describe("Conversation access control", () => {
  interface Conversation {
    id: string;
    trainer_id: string;
    client_id: string;
  }

  function canAccessConversation(
    conv: Conversation,
    userId: string,
    userClientId?: string
  ): boolean {
    // Trainer access
    if (conv.trainer_id === userId) return true;
    // Client access (via client record)
    if (userClientId && conv.client_id === userClientId) return true;
    return false;
  }

  it("trainer can access their own conversation", () => {
    const conv = { id: "conv-1", trainer_id: "t1", client_id: "c1" };
    expect(canAccessConversation(conv, "t1")).toBe(true);
  });

  it("client can access their conversation", () => {
    const conv = { id: "conv-1", trainer_id: "t1", client_id: "c1" };
    expect(canAccessConversation(conv, "user-1", "c1")).toBe(true);
  });

  it("other trainer cannot access conversation", () => {
    const conv = { id: "conv-1", trainer_id: "t1", client_id: "c1" };
    expect(canAccessConversation(conv, "t2")).toBe(false);
  });

  it("other client cannot access conversation", () => {
    const conv = { id: "conv-1", trainer_id: "t1", client_id: "c1" };
    expect(canAccessConversation(conv, "user-2", "c2")).toBe(false);
  });

  it("unauthenticated user cannot access", () => {
    const conv = { id: "conv-1", trainer_id: "t1", client_id: "c1" };
    expect(canAccessConversation(conv, "")).toBe(false);
  });
});

describe("Message ordering", () => {
  interface Message {
    id: string;
    created_at: string;
    content: string;
  }

  function sortMessagesChronological(messages: Message[]): Message[] {
    return [...messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  it("sorts messages oldest first", () => {
    const messages: Message[] = [
      { id: "3", created_at: "2026-03-20T12:00:00Z", content: "third" },
      { id: "1", created_at: "2026-03-20T10:00:00Z", content: "first" },
      { id: "2", created_at: "2026-03-20T11:00:00Z", content: "second" },
    ];

    const sorted = sortMessagesChronological(messages);
    expect(sorted[0].content).toBe("first");
    expect(sorted[1].content).toBe("second");
    expect(sorted[2].content).toBe("third");
  });

  it("handles empty array", () => {
    expect(sortMessagesChronological([])).toEqual([]);
  });

  it("handles single message", () => {
    const messages: Message[] = [
      { id: "1", created_at: "2026-03-20T10:00:00Z", content: "only" },
    ];
    const sorted = sortMessagesChronological(messages);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].content).toBe("only");
  });
});

describe("Unread message counting", () => {
  interface Message {
    id: string;
    sender_id: string;
    read: boolean;
  }

  function countUnread(messages: Message[], currentUserId: string): number {
    return messages.filter(
      (m) => m.sender_id !== currentUserId && !m.read
    ).length;
  }

  it("counts unread messages from other user", () => {
    const messages: Message[] = [
      { id: "1", sender_id: "t1", read: false },
      { id: "2", sender_id: "t1", read: true },
      { id: "3", sender_id: "c1", read: false }, // own message, don't count
    ];

    expect(countUnread(messages, "c1")).toBe(1);
  });

  it("returns 0 when all read", () => {
    const messages: Message[] = [
      { id: "1", sender_id: "t1", read: true },
      { id: "2", sender_id: "t1", read: true },
    ];

    expect(countUnread(messages, "c1")).toBe(0);
  });

  it("returns 0 for empty messages", () => {
    expect(countUnread([], "c1")).toBe(0);
  });

  it("does not count own unread messages", () => {
    const messages: Message[] = [
      { id: "1", sender_id: "c1", read: false },
      { id: "2", sender_id: "c1", read: false },
    ];

    expect(countUnread(messages, "c1")).toBe(0);
  });
});
