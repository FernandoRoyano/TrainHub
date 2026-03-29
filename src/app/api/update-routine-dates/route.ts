import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { routineId, clientId, endDate, reviewDate } = await request.json();

  if (!routineId || !clientId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const updateData: Record<string, string | null> = {};
  if (endDate) updateData.end_date = endDate;
  if (reviewDate !== undefined) updateData.review_date = reviewDate;

  const { error } = await supabase
    .from("client_routines")
    .update(updateData)
    .eq("routine_id", routineId)
    .eq("client_id", clientId)
    .eq("trainer_id", user.id)
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
