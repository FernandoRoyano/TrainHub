import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/simple-rate-limit";
import { getClientIp } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const VERIFY_INVITE_RPM = 30;
const tokenSchema = z.uuid();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = tokenSchema.safeParse(searchParams.get("token"));

  // Rechaza tokens con formato inválido antes de tocar la DB (evita enumeración)
  if (!parsed.success) {
    return NextResponse.json({ valid: false });
  }
  const token = parsed.data;

  // Rate-limit por IP: endpoint público con admin client, vector de enumeración
  if (!checkRateLimit(`verify-invite:${getClientIp(request)}`, VERIFY_INVITE_RPM)) {
    return NextResponse.json({ valid: false }, { status: 429 });
  }

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
