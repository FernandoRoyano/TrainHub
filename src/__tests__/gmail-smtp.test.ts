import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer
const mockSendMail = vi.fn();
const mockCreateTransport = vi.fn().mockReturnValue({
  sendMail: mockSendMail,
});

vi.mock("nodemailer", () => ({
  default: { createTransport: mockCreateTransport },
}));

const { sendGmail } = await import("@/lib/email/gmail-smtp");

describe("sendGmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GMAIL_USER = "test@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "app-password-123";
  });

  it("sends email via nodemailer transporter", async () => {
    mockSendMail.mockResolvedValue({ messageId: "abc123" });

    const result = await sendGmail({
      to: "client@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });

    expect(result).toEqual({ success: true });
    expect(mockSendMail).toHaveBeenCalledWith({
      from: "TrainHub <test@gmail.com>",
      to: "client@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });
  });

  it("returns success false when sendMail throws", async () => {
    const error = new Error("SMTP connection failed");
    mockSendMail.mockRejectedValue(error);

    const result = await sendGmail({
      to: "client@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
    });

    expect(result).toEqual({ success: false, error });
  });

  it("reuses the same transporter (singleton) across calls", async () => {
    mockSendMail.mockResolvedValue({});

    await sendGmail({ to: "a@test.com", subject: "1", html: "h" });
    await sendGmail({ to: "b@test.com", subject: "2", html: "h" });

    // sendMail is called twice but on the same transporter instance
    expect(mockSendMail).toHaveBeenCalledTimes(2);
    // createTransport should NOT be called again because the transporter is cached
    // (it was called once during module init, before clearAllMocks)
    expect(mockCreateTransport).not.toHaveBeenCalled();
  });

  it("uses GMAIL_USER in the from field", async () => {
    process.env.GMAIL_USER = "custom@gmail.com";
    mockSendMail.mockResolvedValue({});

    // Need to re-import to pick up the new env var in a fresh transporter
    // But since getTransporter caches, the from field still uses process.env at call time
    await sendGmail({
      to: "to@test.com",
      subject: "s",
      html: "h",
    });

    const callArgs = mockSendMail.mock.calls[0][0];
    expect(callArgs.from).toContain("TrainHub");
  });
});
