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

  // Get last_sign_in_at from auth.users via admin
  const admin = createAdminClient();
  const userIds = clients.filter((c) => c.user_id).map((c) => c.user_id as string);

  if (userIds.length === 0) {
    return NextResponse.json({});
  }

  const { data: authUsers } = await admin.auth.admin.listUsers({
    perPage: 100,
  });

  // Build map: client_id -> last_sign_in_at
  const result: Record<string, string | null> = {};
  for (const client of clients) {
    if (client.user_id) {
      const authUser = authUsers?.users?.find((u) => u.id === client.user_id);
      result[client.id] = authUser?.last_sign_in_at ?? null;
    }
  }

  return NextResponse.json(result);
}
