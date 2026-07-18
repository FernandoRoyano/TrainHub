import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Guarda (o actualiza) la suscripción Web Push del navegador del usuario.
// Upsert por endpoint: si el mismo dispositivo se re-suscribe, refresca las
// claves y lo reasigna al usuario actual (p.ej. otra cuenta en el mismo móvil).
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subscription, userAgent } = await request.json();
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const auth = subscription?.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh,
          auth,
          user_agent: userAgent ?? null,
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("[Push] subscribe error:", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Push] subscribe error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
