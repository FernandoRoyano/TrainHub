import { createClient } from "@/lib/supabase/client";
import type {
  ServiceTierFormData,
  AssignServiceTierData,
  ServiceTierFeatures,
} from "@/lib/validations/service-tier";

export interface ServiceTier {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  color: string | null;
  price: number | null;
  currency: string | null;
  billing_interval: string | null;
  features: ServiceTierFeatures;
  max_revisions_per_month: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientServiceTier {
  id: string;
  client_id: string;
  service_tier_id: string;
  start_date: string | null;
  notes: string | null;
  created_at: string;
  service_tier?: ServiceTier;
}

export const serviceTiersService = {
  async getServiceTiers() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("service_tiers")
      .select("*")
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ServiceTier[];
  },

  async getServiceTierById(id: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("service_tiers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as ServiceTier;
  },

  async createServiceTier(data: ServiceTierFormData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { data: tier, error } = await supabase
      .from("service_tiers")
      .insert({
        trainer_id: user.id,
        name: data.name,
        description: data.description || null,
        color: data.color || null,
        price: data.price ?? null,
        currency: data.currency || null,
        billing_interval: data.billing_interval || null,
        features: data.features,
        max_revisions_per_month: data.max_revisions_per_month ?? null,
        is_active: data.is_active,
      })
      .select()
      .single();
    if (error) throw error;
    return tier as ServiceTier;
  },

  async updateServiceTier(id: string, data: ServiceTierFormData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("service_tiers")
      .update({
        name: data.name,
        description: data.description || null,
        color: data.color || null,
        price: data.price ?? null,
        currency: data.currency || null,
        billing_interval: data.billing_interval || null,
        features: data.features,
        max_revisions_per_month: data.max_revisions_per_month ?? null,
        is_active: data.is_active,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async deleteServiceTier(id: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("service_tiers")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async assignTierToClient(data: AssignServiceTierData) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Insert assignment record
    const { data: assignment, error: assignError } = await supabase
      .from("client_service_tiers")
      .insert({
        client_id: data.client_id,
        service_tier_id: data.service_tier_id,
        start_date: data.start_date || null,
        notes: data.notes || null,
      })
      .select("*, service_tier:service_tiers(*)")
      .single();
    if (assignError) throw assignError;

    // Update the client's active tier reference
    const { error: updateError } = await supabase
      .from("clients")
      .update({ active_service_tier_id: data.service_tier_id })
      .eq("id", data.client_id);
    if (updateError) throw updateError;

    return assignment as ClientServiceTier;
  },

  async getClientServiceTier(clientId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("client_service_tiers")
      .select("*, service_tier:service_tiers(*)")
      .eq("client_id", clientId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as ClientServiceTier | null;
  },

  async removeClientTier(clientId: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Cancela la asignación viva: las lecturas usan client_service_tiers, así
    // que poner solo active_service_tier_id a null dejaba el tier "activo"
    // (y sus restricciones) tanto para el trainer como para el cliente.
    const { error: cancelError } = await supabase
      .from("client_service_tiers")
      .update({ status: "cancelled", end_date: new Date().toISOString().split("T")[0] })
      .eq("client_id", clientId)
      .eq("status", "active");
    if (cancelError) throw cancelError;

    const { error: updateError } = await supabase
      .from("clients")
      .update({ active_service_tier_id: null })
      .eq("id", clientId);
    if (updateError) throw updateError;
  },
};
