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

  // Query auth.users directly via admin client (SQL)
  const admin = createAdminClient();
  const { data: authData } = await admin
    .from("users")
    .select("id, last_sign_in_at:updated_at")
    .in("id", userIds);

  // Also try getting from auth.users via admin API for each user
  const result: Record<string, string | null> = {};

  for (const client of clients) {
    if (!client.user_id) continue;

    // Try from the public users table first
    const publicUser = authData?.find((u: { id: string }) => u.id === client.user_id);
    if (publicUser?.last_sign_in_at) {
      result[client.id] = publicUser.last_sign_in_at;
      continue;
    }

    // Fallback: get from auth admin
    try {
      const { data: authUser } = await admin.auth.admin.getUserById(client.user_id);
      result[client.id] = authUser?.user?.last_sign_in_at ?? null;
    } catch {
      result[client.id] = null;
    }
  }

  return NextResponse.json(result);
}
