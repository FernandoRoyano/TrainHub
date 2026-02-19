import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false });
  }

  // Use admin client since this is a public endpoint (no auth)
  const admin = createAdminClient();
  const { data: client } = await admin
    .from("clients")
    .select("full_name, user_id")
    .eq("invite_token", token)
    .maybeSingle();

  if (!client || client.user_id) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, clientName: client.full_name });
}
