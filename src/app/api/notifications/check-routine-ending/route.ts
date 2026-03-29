import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = createAdminClient();
  const today = new Date();
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  const targetDate = twoDaysFromNow.toISOString().split("T")[0];

  // Find active routines ending in 2 days
  const { data: endingRoutines } = await admin
    .from("client_routines")
    .select("id, trainer_id, client_id, end_date, clients(full_name), routines(name)")
    .eq("status", "active")
    .eq("end_date", targetDate);

  if (!endingRoutines || endingRoutines.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  let created = 0;

  for (const cr of endingRoutines) {
    const clientName = (cr.clients as unknown as { full_name: string } | null)?.full_name ?? "Cliente";
    const routineName = (cr.routines as unknown as { name: string } | null)?.name ?? "Rutina";

    // Check if notification already exists for this routine ending
    const { count } = await admin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", cr.trainer_id)
      .eq("type", "routine_ending")
      .contains("metadata", { client_routine_id: cr.id });

    if (count && count > 0) continue;

    // Create notification for trainer
    await admin.from("notifications").insert({
      user_id: cr.trainer_id,
      type: "routine_ending",
      title: `La rutina de ${clientName} termina en 2 días`,
      body: `"${routineName}" finaliza el ${cr.end_date}. Contacta con ${clientName} para planificar la revisión.`,
      link: `/clients/${cr.client_id}`,
      metadata: { client_routine_id: cr.id, client_id: cr.client_id },
    });
    created++;
  }

  // Also check review dates for today
  const todayStr = today.toISOString().split("T")[0];
  const { data: reviewRoutines } = await admin
    .from("client_routines")
    .select("id, trainer_id, client_id, review_date, clients(full_name, user_id), routines(name)")
    .eq("status", "active")
    .eq("review_date", todayStr);

  if (reviewRoutines) {
    for (const cr of reviewRoutines) {
      const clientName = (cr.clients as unknown as { full_name: string; user_id: string | null } | null)?.full_name ?? "Cliente";
      const clientUserId = (cr.clients as unknown as { full_name: string; user_id: string | null } | null)?.user_id;
      const routineName = (cr.routines as unknown as { name: string } | null)?.name ?? "Rutina";

      // Check if already notified
      const { count } = await admin
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", cr.trainer_id)
        .eq("type", "review_reminder")
        .contains("metadata", { client_routine_id: cr.id });

      if (count && count > 0) continue;

      // Notify trainer
      await admin.from("notifications").insert({
        user_id: cr.trainer_id,
        type: "review_reminder",
        title: `Hoy es la revisión de ${clientName}`,
        body: `Revisión programada para "${routineName}".`,
        link: `/clients/${cr.client_id}`,
        metadata: { client_routine_id: cr.id },
      });

      // Notify client
      if (clientUserId) {
        await admin.from("notifications").insert({
          user_id: clientUserId,
          type: "review_reminder",
          title: "Hoy tienes revisión con tu entrenador",
          body: `Tu entrenador ha programado una revisión de "${routineName}".`,
          link: "/my-routine",
          metadata: { client_routine_id: cr.id },
        });
      }

      created++;
    }
  }

  return NextResponse.json({ created });
}
