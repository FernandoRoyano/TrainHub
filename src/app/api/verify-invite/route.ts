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
    .select("full_name, email, phone, user_id, trainer_id, invite_token_expires_at")
    .eq("invite_token", token)
    .maybeSingle();

  if (!client || client.user_id) {
    return NextResponse.json({ valid: false });
  }

  if (client.invite_token_expires_at &&
      new Date() > new Date(client.invite_token_expires_at)) {
    return NextResponse.json({ valid: false, reason: "expired" });
  }

  const isPlaceholder = client.email?.startsWith("pending-") || client.full_name === "Nuevo cliente";
  return NextResponse.json({
    valid: true,
    clientName: isPlaceholder ? "" : client.full_name,
    clientEmail: isPlaceholder ? "" : client.email,
    clientPhone: client.phone,
    hasProfile: !isPlaceholder && !!(client.email && client.full_name),
    isOpenInvite: isPlaceholder,
    trainerId: client.trainer_id,
  });
}
