import { createClient } from "@/lib/supabase/client";
import type { ClientFormData } from "@/lib/validations/client";

export interface Client {
  id: string;
  trainer_id: string;
  user_id: string | null;
  email: string | null;
  full_name: string;
  phone: string | null;
  status: string;
  profile_data: Record<string, unknown>;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const clientsService = {
  async getClients(filters?: ClientFilters) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 20;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("clients")
      .select("*", { count: "exact" })
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as Client[], count: count ?? 0 };
  },

  async getClientById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Client;
  },

  async createClient(data: ClientFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        ...data,
        trainer_id: user.id,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw error;
    return client as Client;
  },

  async updateClient(id: string, data: Partial<ClientFormData>) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("clients")
      .update({
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async deleteClient(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async getClientStats() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("clients")
      .select("status")
      .eq("trainer_id", user.id);
    if (error) throw error;

    const stats = {
      total: data.length,
      active: data.filter((c) => c.status === "active").length,
      inactive: data.filter((c) => c.status === "inactive").length,
      paused: data.filter((c) => c.status === "paused").length,
      pending: data.filter((c) => c.status === "pending").length,
    };
    return stats;
  },
};
