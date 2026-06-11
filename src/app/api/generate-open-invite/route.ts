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

  // Create a placeholder client with just the invite token (no name/email)
  const token = crypto.randomUUID();
  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      trainer_id: user.id,
      full_name: "Nuevo cliente",
      email: `pending-${token}@placeholder.local`,
      status: "pending",
      invite_token: token,
      // Caducidad obligatoria: sin expires_at el enlace era válido para siempre
      invite_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { origin } = new URL(request.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  return NextResponse.json({
    link: `${appUrl}/es/join/${token}`,
    clientId: client.id,
  });
}
