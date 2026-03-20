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

  const { clientId } = await request.json();
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  // Verify the client belongs to this trainer and has no account yet
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, full_name, user_id, invite_token")
    .eq("id", clientId)
    .eq("trainer_id", user.id)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (client.user_id) {
    return NextResponse.json(
      { error: "Client already has an account" },
      { status: 400 }
    );
  }

  // Reuse existing token or generate a new one
  let token = client.invite_token;
  if (!token) {
    token = crypto.randomUUID();
    const { error: updateError } = await supabase
      .from("clients")
      .update({ invite_token: token })
      .eq("id", client.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }
  }

  const { origin } = new URL(request.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  return NextResponse.json({ link: `${appUrl}/join/${token}` });
}
