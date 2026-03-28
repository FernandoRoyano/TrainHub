import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendGmail } from "@/lib/email/gmail-smtp";
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
  const t = getEmailTranslations(locale);
  const trainerName = trainer?.full_name || "Tu entrenador";
  const clientName = client.full_name || client.email;

  // Send branded email via Gmail SMTP
  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background: #f8f8f8;">
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="font-size: 24px; font-weight: 700; color: #6dbd57;">TrainHub</span>
      </div>
      <div style="background: #ffffff; border-radius: 12px; padding: 32px 28px; border: 1px solid #e5e7eb;">
        <p style="font-size: 20px; font-weight: 600; color: #1a1f36;">
          ${t.inviteTitle.replace("{name}", clientName)}
        </p>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
          ${t.inviteBody.replace("{trainer}", trainerName)}
        </p>
        <a href="${joinUrl}" style="display: inline-block; margin-top: 16px; background: #6dbd57; color: #ffffff; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none;">
          ${t.inviteCta}
        </a>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; line-height: 1.5;">
          ${t.inviteFooter}
        </p>
      </div>
      <div style="text-align: center; margin-top: 32px;">
        <span style="font-size: 12px; color: #6b7280;">TrainHub - Personal Training Platform</span>
      </div>
    </div>
  `;

  const { success, error: emailError } = await sendGmail({
    to: client.email,
    subject: t.inviteSubject.replace("{trainer}", trainerName),
    html,
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
