import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client chain
const mockEq2 = vi.fn();
const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });
const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 });
const mockGetUser = vi.fn();

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: vi.fn().mockImplementation(() => ({
    update: mockUpdate,
    delete: mockDelete,
  })),
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const { routinesService } = await import("@/services/routines.service");

describe("routinesService.cancelClientRoutine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(routinesService.cancelClientRoutine("cr-1")).rejects.toThrow(
      "Not authenticated"
    );
  });

  it("updates client_routines status to cancelled", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockEq2.mockResolvedValue({ error: null });

    await routinesService.cancelClientRoutine("cr-1");

    expect(mockSupabase.from).toHaveBeenCalledWith("client_routines");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "cancelled" });
    expect(mockEq1).toHaveBeenCalledWith("id", "cr-1");
    expect(mockEq2).toHaveBeenCalledWith("trainer_id", "trainer-1");
  });

  it("throws when supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockEq2.mockResolvedValue({ error: { message: "RLS violation" } });

    await expect(routinesService.cancelClientRoutine("cr-1")).rejects.toThrow();
  });
});

describe("routinesService.deleteClientRoutine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(routinesService.deleteClientRoutine("cr-1")).rejects.toThrow(
      "Not authenticated"
    );
  });

  it("deletes from client_routines table", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockEq2.mockResolvedValue({ error: null });

    await routinesService.deleteClientRoutine("cr-1");

    expect(mockSupabase.from).toHaveBeenCalledWith("client_routines");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq1).toHaveBeenCalledWith("id", "cr-1");
    expect(mockEq2).toHaveBeenCalledWith("trainer_id", "trainer-1");
  });

  it("throws when supabase returns an error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-1" } } });
    mockEq2.mockResolvedValue({ error: { message: "Not found" } });

    await expect(routinesService.deleteClientRoutine("cr-1")).rejects.toThrow();
  });

  it("scopes delete to the authenticated trainer", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "trainer-99" } } });
    mockEq2.mockResolvedValue({ error: null });

    await routinesService.deleteClientRoutine("cr-5");

    expect(mockEq2).toHaveBeenCalledWith("trainer_id", "trainer-99");
  });
});
