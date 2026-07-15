import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteUserCompletely } from "@/lib/auth/delete-user";

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

  // client_limit_override puede no existir aún (migración 00047 pendiente):
  // se degrada al set de columnas base para no romper la página.
  const baseCols = "id, full_name, email, role, subscription_tier, created_at, updated_at";
  const buildQuery = (cols: string) => {
    let q = admin
      .from("users")
      .select(cols, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (search) {
      const safeSearch = search.replace(/[,()*]/g, " ").trim();
      if (safeSearch) q = q.or(`full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%`);
    }
    if (role) q = q.eq("role", role);
    return q;
  };

  let { data, count, error } = await buildQuery(`${baseCols}, client_limit_override`);
  if (error?.message?.includes("client_limit_override")) {
    ({ data, count, error } = await buildQuery(baseCols));
  }
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
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Rama: fijar cupo de clientes personalizado (null = usar límite del plan)
  if ("clientLimitOverride" in body) {
    const val = body.clientLimitOverride;
    if (
      val !== null &&
      (typeof val !== "number" || !Number.isInteger(val) || val < 0 || val > 100000)
    ) {
      return NextResponse.json({ error: "Invalid client limit" }, { status: 400 });
    }
    const { error } = await admin
      .from("users")
      .update({ client_limit_override: val })
      .eq("id", userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  // Rama: cambio de rol
  const { role: newRole } = body;

  if (!newRole) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
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

export async function DELETE(request: NextRequest) {
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

  const { userId } = await request.json();
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  if (userId === user.id) {
    return NextResponse.json(
      { error: "Cannot delete own account here" },
      { status: 400 }
    );
  }

  const { error } = await deleteUserCompletely(admin, userId);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
