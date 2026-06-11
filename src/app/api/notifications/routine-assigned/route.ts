import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send-email";
import { RoutineAssignedEmail } from "@/lib/email/templates/routine-assigned";
import { getEmailTranslations, getLocaleForEmail } from "@/lib/email/translations";

export async function POST(request: Request) {
  try {
    // Esta ruta la llaman los hooks del navegador tras asignar una rutina, no
    // el cron: exigir CRON_SECRET hacía que devolviera 401 siempre y el email
    // de asignación nunca se enviara. La autorización correcta es el usuario
    // autenticado + que el cliente le pertenezca.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { clientId, routineId, startDate } = await request.json();
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

    const { data: routine } = await admin
      .from("routines")
      .select("name")
      .eq("id", routineId)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await sendEmail({
      to: client.email,
      subject: t.routineAssignedSubject,
      react: RoutineAssignedEmail({
        clientName: client.full_name,
        routineName: routine?.name || "Routine",
        startDate: startDate || "",
        appUrl: `${appUrl}/${locale}`,
        t,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notification] routine-assigned error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
