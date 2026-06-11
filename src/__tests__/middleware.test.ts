import { describe, it, expect } from "vitest";

// Test the role-based routing logic extracted from middleware
// We test the pure logic, not the Next.js middleware wrapper

function getRouteRedirect(pathname: string, role?: string): string | null {
  const isClient = role === "client";
  const isAdmin = role === "admin";
  const isAdminRoute = pathname.includes("/admin");
  const isTrainerRoute =
    pathname.includes("/dashboard") ||
    pathname.includes("/clients") ||
    pathname.includes("/exercises") ||
    pathname.includes("/routines") ||
    pathname.includes("/nutrition") ||
    pathname.includes("/messages") ||
    pathname.includes("/settings") ||
    pathname.includes("/templates") ||
    pathname.includes("/analytics") ||
    pathname.includes("/blocks") ||
    pathname.includes("/calendar");
  const isClientRoute =
    pathname.includes("/my-routine") ||
    pathname.includes("/my-nutrition") ||
    pathname.includes("/my-progress") ||
    pathname.includes("/my-messages") ||
    pathname.includes("/my-profile") ||
    pathname.includes("/my-measurements");

  if (isAdminRoute && !isAdmin) {
    return isClient ? "/my-routine" : "/dashboard";
  }

  if (isClient && isTrainerRoute) {
    return "/my-routine";
  }

  if (!isClient && isClientRoute) {
    return "/dashboard";
  }

  return null;
}

describe("Middleware route protection logic", () => {
  describe("Admin routes", () => {
    it("allows admin to access /admin", () => {
      expect(getRouteRedirect("/admin", "admin")).toBeNull();
    });

    it("allows admin to access /admin/users", () => {
      expect(getRouteRedirect("/admin/users", "admin")).toBeNull();
    });

    it("redirects trainer from /admin to /dashboard", () => {
      expect(getRouteRedirect("/admin", "trainer")).toBe("/dashboard");
    });

    it("redirects client from /admin to /my-routine", () => {
      expect(getRouteRedirect("/admin", "client")).toBe("/my-routine");
    });
  });

  describe("Trainer routes", () => {
    it("allows trainer to access /dashboard", () => {
      expect(getRouteRedirect("/dashboard", "trainer")).toBeNull();
    });

    it("allows trainer to access /clients", () => {
      expect(getRouteRedirect("/clients", "trainer")).toBeNull();
    });

    it("allows trainer to access /routines", () => {
      expect(getRouteRedirect("/routines", "trainer")).toBeNull();
    });

    it("allows trainer to access /analytics", () => {
      expect(getRouteRedirect("/analytics", "trainer")).toBeNull();
    });

    it("allows trainer to access /templates", () => {
      expect(getRouteRedirect("/templates", "trainer")).toBeNull();
    });

    it("redirects client from /dashboard to /my-routine", () => {
      expect(getRouteRedirect("/dashboard", "client")).toBe("/my-routine");
    });

    it("redirects client from /clients to /my-routine", () => {
      expect(getRouteRedirect("/clients", "client")).toBe("/my-routine");
    });

    it("allows admin to access trainer routes", () => {
      expect(getRouteRedirect("/dashboard", "admin")).toBeNull();
      expect(getRouteRedirect("/clients", "admin")).toBeNull();
      expect(getRouteRedirect("/routines", "admin")).toBeNull();
    });
  });

  describe("Client routes", () => {
    it("allows client to access /my-routine", () => {
      expect(getRouteRedirect("/my-routine", "client")).toBeNull();
    });

    it("allows client to access /my-progress", () => {
      expect(getRouteRedirect("/my-progress", "client")).toBeNull();
    });

    it("allows client to access /my-measurements", () => {
      expect(getRouteRedirect("/my-measurements", "client")).toBeNull();
    });

    it("redirects trainer from /my-routine to /dashboard", () => {
      expect(getRouteRedirect("/my-routine", "trainer")).toBe("/dashboard");
    });

    it("redirects admin from /my-routine to /dashboard", () => {
      expect(getRouteRedirect("/my-routine", "admin")).toBe("/dashboard");
    });
  });
});
