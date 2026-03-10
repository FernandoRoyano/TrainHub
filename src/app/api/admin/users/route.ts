import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = 20;
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = admin
    .from("users")
    .select("id, full_name, email, role, subscription_tier, created_at, updated_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq("role", role);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data, count: count ?? 0 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { userId, role: newRole } = body;

  if (!userId || !newRole) {
    return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
  }

  if (!["admin", "trainer", "client"].includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent self-demotion
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot change own role" }, { status: 400 });
  }

  const { error: updateError } = await admin
    .from("users")
    .update({ role: newRole })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Also update auth metadata
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { role: newRole },
  });

  return NextResponse.json({ success: true });
}
