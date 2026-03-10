import { describe, it, expect, vi, beforeEach } from "vitest";

// Test the admin service fetch logic
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Re-import after mock
const { adminService } = await import("@/services/admin.service");

describe("adminService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getStats", () => {
    it("calls /api/admin/stats", async () => {
      const mockData = {
        totalUsers: 10,
        totalTrainers: 3,
        totalClients: 7,
        totalRoutines: 15,
        totalExercises: 50,
        paidSubscriptions: 2,
        recentUsers: [],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await adminService.getStats();
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/stats");
      expect(result.totalUsers).toBe(10);
      expect(result.totalTrainers).toBe(3);
    });

    it("throws on error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(adminService.getStats()).rejects.toThrow(
        "Failed to fetch admin stats"
      );
    });
  });

  describe("getUsers", () => {
    it("passes search params correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ users: [], count: 0 }),
      });

      await adminService.getUsers({ search: "john", role: "trainer", page: 1 });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain("search=john");
      expect(calledUrl).toContain("role=trainer");
      expect(calledUrl).toContain("page=1");
    });

    it("works without filters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ users: [], count: 0 }),
      });

      await adminService.getUsers();

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toBe("/api/admin/users?");
    });
  });

  describe("updateUserRole", () => {
    it("sends PATCH with correct body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await adminService.updateUserRole("user-123", "admin");

      expect(mockFetch).toHaveBeenCalledWith("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user-123", role: "admin" }),
      });
    });

    it("throws with error message on failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Cannot change own role" }),
      });

      await expect(
        adminService.updateUserRole("self-id", "trainer")
      ).rejects.toThrow("Cannot change own role");
    });
  });
});
