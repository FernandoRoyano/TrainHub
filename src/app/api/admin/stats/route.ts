import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch all stats in parallel
  const [
    usersResult,
    trainersResult,
    clientsResult,
    routinesResult,
    exercisesResult,
    subscriptionsResult,
    recentUsersResult,
  ] = await Promise.all([
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("users").select("*", { count: "exact", head: true }).eq("role", "trainer"),
    admin.from("clients").select("*", { count: "exact", head: true }),
    admin.from("routines").select("*", { count: "exact", head: true }),
    admin.from("exercises").select("*", { count: "exact", head: true }),
    admin.from("subscriptions").select("*", { count: "exact", head: true }).neq("tier", "free"),
    admin
      .from("users")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    totalUsers: usersResult.count ?? 0,
    totalTrainers: trainersResult.count ?? 0,
    totalClients: clientsResult.count ?? 0,
    totalRoutines: routinesResult.count ?? 0,
    totalExercises: exercisesResult.count ?? 0,
    paidSubscriptions: subscriptionsResult.count ?? 0,
    recentUsers: recentUsersResult.data ?? [],
  });
}
