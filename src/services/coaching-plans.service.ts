import { createClient } from "@/lib/supabase/client";
import type { CoachingPlanFormData } from "@/lib/validations/coaching-plan";

export interface CoachingPlan {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  duration_weeks: number;
  service_tier_id: string | null;
  routine_template_id: string | null;
  meal_plan_template_id: string | null;
  price: number | null;
  currency: string | null;
  tags: string[] | null;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  questionnaire_template_ids?: string[];
  // Joined relations
  service_tier?: { id: string; name: string; color: string | null; features?: Record<string, boolean> } | null;
  routine_template?: { id: string; name: string } | null;
  meal_plan_template?: { id: string; name: string } | null;
}

export interface ClientCoachingPlan {
  id: string;
  client_id: string;
  coaching_plan_id: string;
  trainer_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
  client_routine_id: string | null;
  client_meal_plan_id: string | null;
  client_service_tier_id: string | null;
  created_at: string;
  coaching_plan?: CoachingPlan;
}

export interface CoachingPlanFilters {
  search?: string;
  is_active?: boolean;
  is_published?: boolean;
  page?: number;
  pageSize?: number;
}

export const coachingPlansService = {
  async getCoachingPlans(filters?: CoachingPlanFilters) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("coaching_plans")
      .select(
        "*, service_tier:service_tiers(id, name, color, features), routine_template:routines!coaching_plans_routine_template_id_fkey(id, name), meal_plan_template:meal_plans!coaching_plans_meal_plan_template_id_fkey(id, name)",
        { count: "exact" }
      )
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    if (filters?.is_published !== undefined) {
      query = query.eq("is_published", filters.is_published);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as CoachingPlan[], count: count ?? 0 };
  },

  async getCoachingPlanById(id: string) {
    const supabase = createClient();

    const { data: plan, error: planError } = await supabase
      .from("coaching_plans")
      .select(
        "*, service_tier:service_tiers(id, name, color, features), routine_template:routines!coaching_plans_routine_template_id_fkey(id, name), meal_plan_template:meal_plans!coaching_plans_meal_plan_template_id_fkey(id, name)"
      )
      .eq("id", id)
      .single();
    if (planError) throw planError;

    // Get questionnaire template IDs
    const { data: questLinks, error: questError } = await supabase
      .from("coaching_plan_questionnaires")
      .select("questionnaire_template_id")
      .eq("coaching_plan_id", id);
    if (questError) throw questError;

    const questionnaire_template_ids = (questLinks ?? []).map(
      (q) => q.questionnaire_template_id
    );

    return { ...plan, questionnaire_template_ids } as CoachingPlan;
  },

  async createCoachingPlan(data: CoachingPlanFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { questionnaire_template_ids, ...planData } = data;

    const { data: plan, error: planError } = await supabase
      .from("coaching_plans")
      .insert({
        trainer_id: user.id,
        name: planData.name,
        description: planData.description || null,
        cover_image: planData.cover_image || null,
        duration_weeks: planData.duration_weeks,
        service_tier_id: planData.service_tier_id || null,
        routine_template_id: planData.routine_template_id || null,
        meal_plan_template_id: planData.meal_plan_template_id || null,
        price: planData.price ?? null,
        currency: planData.currency || null,
        tags: planData.tags ?? null,
        is_active: planData.is_active,
        is_published: planData.is_published,
      })
      .select()
      .single();
    if (planError) throw planError;

    // Insert questionnaire links
    if (questionnaire_template_ids && questionnaire_template_ids.length > 0) {
      const links = questionnaire_template_ids.map((qtId) => ({
        coaching_plan_id: plan.id,
        questionnaire_template_id: qtId,
      }));
      const { error: linkError } = await supabase
        .from("coaching_plan_questionnaires")
        .insert(links);
      if (linkError) throw linkError;
    }

    return plan as CoachingPlan;
  },

  async updateCoachingPlan(id: string, data: CoachingPlanFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { questionnaire_template_ids, ...planData } = data;

    const { error: planError } = await supabase
      .from("coaching_plans")
      .update({
        name: planData.name,
        description: planData.description || null,
        cover_image: planData.cover_image || null,
        duration_weeks: planData.duration_weeks,
        service_tier_id: planData.service_tier_id || null,
        routine_template_id: planData.routine_template_id || null,
        meal_plan_template_id: planData.meal_plan_template_id || null,
        price: planData.price ?? null,
        currency: planData.currency || null,
        tags: planData.tags ?? null,
        is_active: planData.is_active,
        is_published: planData.is_published,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (planError) throw planError;

    // Delete existing questionnaire links, then recreate
    const { error: deleteError } = await supabase
      .from("coaching_plan_questionnaires")
      .delete()
      .eq("coaching_plan_id", id);
    if (deleteError) throw deleteError;

    if (questionnaire_template_ids && questionnaire_template_ids.length > 0) {
      const links = questionnaire_template_ids.map((qtId) => ({
        coaching_plan_id: id,
        questionnaire_template_id: qtId,
      }));
      const { error: linkError } = await supabase
        .from("coaching_plan_questionnaires")
        .insert(links);
      if (linkError) throw linkError;
    }
  },

  async deleteCoachingPlan(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("coaching_plans")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async duplicateCoachingPlan(id: string, copySuffix = "(copy)") {
    const plan = await this.getCoachingPlanById(id);
    const formData: CoachingPlanFormData = {
      name: `${plan.name} ${copySuffix}`,
      description: plan.description ?? "",
      cover_image: plan.cover_image ?? "",
      duration_weeks: plan.duration_weeks,
      service_tier_id: plan.service_tier_id ?? "",
      routine_template_id: plan.routine_template_id ?? "",
      meal_plan_template_id: plan.meal_plan_template_id ?? "",
      questionnaire_template_ids: plan.questionnaire_template_ids ?? [],
      price: plan.price ?? undefined,
      currency: plan.currency ?? "",
      tags: plan.tags ?? [],
      is_active: plan.is_active,
      is_published: false,
    };
    return this.createCoachingPlan(formData);
  },

  async getClientCoachingPlan(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_coaching_plans")
      .select("*, coaching_plan:coaching_plans(*, service_tier:service_tiers(id, name, color, features))")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as ClientCoachingPlan | null;
  },

  async getClientCoachingPlanHistory(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("client_coaching_plans")
      .select("*, coaching_plan:coaching_plans(*)")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ClientCoachingPlan[];
  },

  async cancelClientCoachingPlan(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("client_coaching_plans")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },
};
