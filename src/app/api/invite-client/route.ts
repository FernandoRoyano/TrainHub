import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  // Verify the client belongs to this trainer
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, email, full_name, user_id")
    .eq("id", clientId)
    .eq("trainer_id", user.id)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!client.email) {
    return NextResponse.json({ error: "Client has no email" }, { status: 400 });
  }

  if (client.user_id) {
    return NextResponse.json(
      { error: "Client already has an account" },
      { status: 400 }
    );
  }

  // Invite via Supabase Admin
  const admin = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    client.email,
    {
      redirectTo: `${appUrl}/auth/callback?next=/my-routine`,
      data: {
        full_name: client.full_name,
        role: "client",
      },
    }
  );

  if (inviteError) {
    return NextResponse.json(
      { error: inviteError.message },
      { status: 500 }
    );
  }

  // Update client status to pending
  await supabase
    .from("clients")
    .update({ status: "pending" })
    .eq("id", clientId);

  return NextResponse.json({ success: true });
}
