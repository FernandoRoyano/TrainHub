export interface AdminStats {
  totalUsers: number;
  totalTrainers: number;
  totalClients: number;
  totalRoutines: number;
  totalExercises: number;
  paidSubscriptions: number;
  recentUsers: {
    id: string;
    full_name: string | null;
    email: string;
    role: string;
    created_at: string;
  }[];
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  subscription_tier: string | null;
  client_limit_override: number | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserFilters {
  search?: string;
  role?: string;
  page?: number;
}

export type BillingClass = "paid" | "free" | "problem";

export interface AdminSubscription {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  client_limit_override: number | null;
  tier: string;
  status: string | null;
  billing_interval: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  billingClass: BillingClass;
  clientCount: number;
  revenueThisMonth: number;
  revenueTotal: number;
}

export interface AdminSubscriptionsResponse {
  trainers: AdminSubscription[];
  summary: {
    total: number;
    paid: number;
    free: number;
    problem: number;
    revenueThisMonth: number;
    revenueTotal: number;
  };
}

export interface StripeHealthCheck {
  key: string;
  ok: boolean;
  detail: string;
  critical: boolean;
}

export interface StripeHealth {
  ok: boolean;
  mode: "live" | "test" | "unknown";
  paymentsEnabled: boolean;
  account: { id: string; chargesEnabled: boolean } | null;
  checks: StripeHealthCheck[];
  lastWebhook: { type: string; receivedAt: string } | null;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await fetch("/api/admin/stats");
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },

  async getUsers(
    filters?: AdminUserFilters
  ): Promise<{ users: AdminUser[]; count: number }> {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.role) params.set("role", filters.role);
    if (filters?.page !== undefined) params.set("page", String(filters.page));

    const res = await fetch(`/api/admin/users?${params}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  async getSubscriptions(): Promise<AdminSubscriptionsResponse> {
    const res = await fetch("/api/admin/subscriptions");
    if (!res.ok) throw new Error("Failed to fetch subscriptions");
    return res.json();
  },

  async getStripeHealth(): Promise<StripeHealth> {
    const res = await fetch("/api/admin/stripe-health");
    if (!res.ok) throw new Error("Failed to fetch Stripe health");
    return res.json();
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update role");
    }
  },

  async setClientLimit(userId: string, limit: number | null): Promise<void> {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, clientLimitOverride: limit }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to set client limit");
    }
  },

  async deleteUser(userId: string): Promise<void> {
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete user");
    }
  },
};
