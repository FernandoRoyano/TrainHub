import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send-email";
import { MealPlanAssignedEmail } from "@/lib/email/templates/meal-plan-assigned";
import { getEmailTranslations, getLocaleForEmail } from "@/lib/email/translations";

export async function POST(request: Request) {
  try {
    // Llamada desde hooks del navegador, no desde el cron: el check de
    // CRON_SECRET devolvía 401 siempre y el email nunca se enviaba.
    // Autorización correcta: usuario autenticado + cliente del trainer.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { clientId, mealPlanId, startDate } = await request.json();
    const admin = createAdminClient();

    const { data: client } = await admin
      .from("clients")
      .select("email, full_name, user_id")
      .eq("id", clientId)
      .eq("trainer_id", user.id)
      .single();

    if (!client?.email || !client.user_id) {
      return NextResponse.json({ skipped: true });
    }

    const { data: userRecord } = await admin
      .from("users")
      .select("settings")
      .eq("id", client.user_id)
      .single();

    const locale = getLocaleForEmail(
      (userRecord?.settings as Record<string, string> | null)?.locale
    );
    const t = getEmailTranslations(locale);

    const { data: mealPlan } = await admin
      .from("meal_plans")
      .select("name")
      .eq("id", mealPlanId)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await sendEmail({
      to: client.email,
      subject: t.mealPlanAssignedSubject,
      react: MealPlanAssignedEmail({
        clientName: client.full_name,
        planName: mealPlan?.name || "Meal Plan",
        startDate: startDate || "",
        appUrl: `${appUrl}/${locale}`,
        t,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notification] meal-plan-assigned error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
