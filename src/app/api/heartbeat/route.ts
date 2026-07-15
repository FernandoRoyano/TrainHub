import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Estampa clients.last_active_at para el cliente autenticado.
// Throttle: solo escribe si el último acceso es null o de hace >15 min,
// para no generar una escritura por cada navegación.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  // RLS no deja al cliente actualizar su propia fila (solo SELECT); service role.
  await admin
    .from("clients")
    .update({ last_active_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .or(`last_active_at.is.null,last_active_at.lt.${cutoff}`);

  return NextResponse.json({ ok: true });
}
