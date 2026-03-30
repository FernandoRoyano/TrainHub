import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Authenticate the trainer
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const {
      client_id,
      coaching_plan_id,
      start_date,
      notes,
      routine_override_id,
      meal_plan_override_id,
    } = body;

    if (!client_id || !coaching_plan_id || !start_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // 1. Validate coaching plan exists and belongs to trainer
    const { data: plan, error: planError } = await admin
      .from("coaching_plans")
      .select("*")
      .eq("id", coaching_plan_id)
      .eq("trainer_id", user.id)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "Coaching plan not found" },
        { status: 404 }
      );
    }

    // 2. Deactivate any existing active client_coaching_plan for this client
    const { data: existingPlans } = await admin
      .from("client_coaching_plans")
      .select("id")
      .eq("client_id", client_id)
      .eq("trainer_id", user.id)
      .eq("status", "active");

    if (existingPlans && existingPlans.length > 0) {
      const existingIds = existingPlans.map((p) => p.id);
      await admin
        .from("client_coaching_plans")
        .update({ status: "completed" })
        .in("id", existingIds);
    }

    // Calculate end date
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + plan.duration_weeks * 7);
    const end_date = endDateObj.toISOString().split("T")[0];

    // Get questionnaire template IDs
    const { data: questLinks } = await admin
      .from("coaching_plan_questionnaires")
      .select("questionnaire_template_id")
      .eq("coaching_plan_id", coaching_plan_id);

    const questionnaireTemplateIds = (questLinks ?? []).map(
      (q) => q.questionnaire_template_id
    );

    let client_routine_id: string | null = null;
    let client_meal_plan_id: string | null = null;
    let client_service_tier_id: string | null = null;

    // Resolve routine: override takes precedence, then plan template
    const effectiveRoutineId = routine_override_id || plan.routine_template_id;

    // 3. If routine: create client_routine assignment
    if (effectiveRoutineId) {
      const { data: clientRoutine, error: crError } = await admin
        .from("client_routines")
        .insert({
          client_id,
          routine_id: effectiveRoutineId,
          trainer_id: user.id,
          start_date,
          notes: `Auto-assigned from coaching plan: ${plan.name}`,
        })
        .select()
        .single();
      if (crError) {
        console.error("Error creating client routine:", crError);
      } else {
        client_routine_id = clientRoutine.id;
      }
    }

    // Resolve meal plan: override takes precedence, then plan template
    const effectiveMealPlanId = meal_plan_override_id || plan.meal_plan_template_id;

    // 4. If meal plan: create client_meal_plan assignment
    if (effectiveMealPlanId) {
      const { data: clientMealPlan, error: cmError } = await admin
        .from("client_meal_plans")
        .insert({
          client_id,
          meal_plan_id: effectiveMealPlanId,
          trainer_id: user.id,
          start_date,
          notes: `Auto-assigned from coaching plan: ${plan.name}`,
        })
        .select()
        .single();
      if (cmError) {
        console.error("Error creating client meal plan:", cmError);
      } else {
        client_meal_plan_id = clientMealPlan.id;
      }
    }

    // 5. If service_tier_id: create client_service_tiers + update client
    if (plan.service_tier_id) {
      const { data: clientTier, error: ctError } = await admin
        .from("client_service_tiers")
        .insert({
          client_id,
          service_tier_id: plan.service_tier_id,
          trainer_id: user.id,
          start_date,
          status: "active",
        })
        .select()
        .single();
      if (ctError) {
        console.error("Error creating client service tier:", ctError);
      } else {
        client_service_tier_id = clientTier.id;
        await admin
          .from("clients")
          .update({ active_service_tier_id: plan.service_tier_id })
          .eq("id", client_id);
      }
    }

    // 6. For each questionnaire template: create client_questionnaire
    for (const templateId of questionnaireTemplateIds) {
      const { error: cqError } = await admin
        .from("client_questionnaires")
        .insert({
          client_id,
          questionnaire_template_id: templateId,
          trainer_id: user.id,
          status: "pending",
        });
      if (cqError) {
        console.error("Error creating client questionnaire:", cqError);
      }
    }

    // 7. Create client_coaching_plans record
    const { data: clientPlan, error: cpError } = await admin
      .from("client_coaching_plans")
      .insert({
        client_id,
        coaching_plan_id,
        trainer_id: user.id,
        start_date,
        end_date,
        status: "active",
        notes: notes || null,
        client_routine_id,
        client_meal_plan_id,
        client_service_tier_id,
      })
      .select()
      .single();

    if (cpError) {
      console.error("Error creating client coaching plan:", cpError);
      return NextResponse.json(
        { error: "Failed to create client coaching plan" },
        { status: 500 }
      );
    }

    // 8. Update clients.active_coaching_plan_id
    await admin
      .from("clients")
      .update({ active_coaching_plan_id: coaching_plan_id })
      .eq("id", client_id);

    return NextResponse.json({ data: clientPlan });
  } catch (err) {
    console.error("Coaching plan assignment error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
