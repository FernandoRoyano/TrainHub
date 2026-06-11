import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { clientIds } = await request.json();
  if (!Array.isArray(clientIds) || clientIds.length === 0) {
    return NextResponse.json({});
  }

  // Get user_ids for these clients
  const { data: clients } = await supabase
    .from("clients")
    .select("id, user_id")
    .in("id", clientIds)
    .eq("trainer_id", user.id);

  if (!clients || clients.length === 0) {
    return NextResponse.json({});
  }

  const userIds = clients.filter((c) => c.user_id).map((c) => c.user_id as string);
  if (userIds.length === 0) {
    return NextResponse.json({});
  }

  // El last_sign_in_at real solo existe en auth.users (Admin API).
  // El alias anterior sobre public.users.updated_at devolvía la fecha de la
  // última edición de perfil, no la última conexión.
  const admin = createAdminClient();
  const result: Record<string, string | null> = {};

  await Promise.all(
    clients
      .filter((c) => c.user_id)
      .map(async (client) => {
        try {
          const { data: authUser } = await admin.auth.admin.getUserById(client.user_id as string);
          result[client.id] = authUser?.user?.last_sign_in_at ?? null;
        } catch {
          result[client.id] = null;
        }
      })
  );

  return NextResponse.json(result);
}
