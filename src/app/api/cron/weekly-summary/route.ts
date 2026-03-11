import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send-email";
import { WeeklySummaryEmail } from "@/lib/email/templates/weekly-summary";
import { getEmailTranslations, getLocaleForEmail } from "@/lib/email/translations";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get all active clients with their user_id and trainer info
    const { data: clients } = await admin
      .from("clients")
      .select("id, full_name, email, user_id, trainer_id")
      .eq("status", "active")
      .not("user_id", "is", null)
      .not("email", "is", null);

    if (!clients || clients.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let sent = 0;

    for (const client of clients) {
      try {
        // Count workouts logged in the last 7 days
        const { count } = await admin
          .from("workout_logs")
          .select("id", { count: "exact", head: true })
          .eq("client_id", client.id)
          .gte("completed_at", oneWeekAgo.toISOString());

        // Get the number of assigned routine days for context
        const { data: assignment } = await admin
          .from("client_routines")
          .select("routine_id")
          .eq("client_id", client.id)
          .eq("status", "active")
          .order("start_date", { ascending: false })
          .limit(1)
          .maybeSingle();

        let totalDays = 7;
        if (assignment?.routine_id) {
          const { count: dayCount } = await admin
            .from("routine_days")
            .select("id", { count: "exact", head: true })
            .eq("routine_id", assignment.routine_id);
          if (dayCount && dayCount > 0) totalDays = dayCount;
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

        await sendEmail({
          to: client.email!,
          subject: t.weeklySummarySubject,
          react: WeeklySummaryEmail({
            clientName: client.full_name,
            weekWorkouts: count || 0,
            totalDays,
            appUrl: `${appUrl}/${locale}`,
            t,
          }),
        });

        sent++;
      } catch (err) {
        console.error(`[CRON] Failed to send weekly summary to ${client.email}:`, err);
      }
    }

    return NextResponse.json({ sent, total: clients.length });
  } catch (error) {
    console.error("[CRON] weekly-summary error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
