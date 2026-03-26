import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send-email";
import { InviteEmail } from "@/lib/email/templates/invite";
import { getEmailTranslations, getLocaleForEmail } from "@/lib/email/translations";

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
    .select("id, email, full_name, user_id, invite_token")
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

  // Generate invite token if not exists
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

  // Get trainer name for the email
  const { data: trainer } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Build join URL
  const { origin } = new URL(request.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
  const locale = getLocaleForEmail();
  const joinUrl = `${appUrl}/${locale}/join/${token}`;

  // Send branded email via Resend
  const t = getEmailTranslations(locale);
  const { success, error: emailError } = await sendEmail({
    to: client.email,
    subject: t.inviteSubject.replace("{trainer}", trainer?.full_name || "Tu entrenador"),
    react: InviteEmail({
      clientName: client.full_name || client.email,
      trainerName: trainer?.full_name || "Tu entrenador",
      joinUrl,
      t,
    }),
  });

  if (!success) {
    return NextResponse.json(
      { error: emailError?.toString() || "Failed to send email" },
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
