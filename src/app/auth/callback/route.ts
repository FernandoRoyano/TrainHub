import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send-email";
import { WelcomeEmail } from "@/lib/email/templates/welcome";
import { getEmailTranslations, getLocaleForEmail } from "@/lib/email/translations";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Handle token_hash flow (from email template with {{ .TokenHash }})
  if (token_hash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "recovery",
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/es/reset-password`);
    }
    return NextResponse.redirect(`${origin}/es/login`);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // If this is a password recovery flow, redirect to reset page
    if (!error && type === "recovery") {
      return NextResponse.redirect(`${origin}/es/reset-password`);
    }

    if (!error) {
      // Check if this user is a client (link user_id if needed)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        // Use admin client to bypass RLS (client record has no user_id yet)
        const admin = createAdminClient();

        // Try linking by email match
        const { data: client } = await admin
          .from("clients")
          .select("id, user_id, trainer_id, full_name")
          .eq("email", user.email)
          .is("user_id", null)
          .maybeSingle();

        if (client) {
          await admin
            .from("clients")
            .update({ user_id: user.id, status: "active", invite_token: null })
            .eq("id", client.id);

          await admin
            .from("users")
            .update({ role: "client" })
            .eq("id", user.id);

          // Send welcome email (non-blocking)
          sendWelcomeEmail(user.email, client.full_name, client.trainer_id, origin).catch(() => {});

          return NextResponse.redirect(`${origin}/my-routine`);
        }

        // Try linking by invite_token (shareable link flow)
        const inviteToken = user.user_metadata?.invite_token;
        if (inviteToken) {
          const { data: tokenClient } = await admin
            .from("clients")
            .select("id, trainer_id, full_name")
            .eq("invite_token", inviteToken)
            .is("user_id", null)
            .maybeSingle();

          if (tokenClient) {
            await admin
              .from("clients")
              .update({
                user_id: user.id,
                status: "active",
                invite_token: null,
                email: user.email,
              })
              .eq("id", tokenClient.id);

            await admin
              .from("users")
              .update({ role: "client" })
              .eq("id", user.id);

            // Send welcome email (non-blocking)
            sendWelcomeEmail(user.email!, tokenClient.full_name, tokenClient.trainer_id, origin).catch(() => {});

            return NextResponse.redirect(`${origin}/my-routine`);
          }
        }

        // Try linking by full_name match (fallback for clients created without email)
        const fullName = user.user_metadata?.full_name;
        if (fullName) {
          const { data: nameClient } = await admin
            .from("clients")
            .select("id, trainer_id, full_name")
            .ilike("full_name", fullName)
            .is("user_id", null)
            .maybeSingle();

          if (nameClient) {
            await admin
              .from("clients")
              .update({
                user_id: user.id,
                status: "active",
                email: user.email,
              })
              .eq("id", nameClient.id);

            await admin
              .from("users")
              .update({ role: "client" })
              .eq("id", user.id);

            sendWelcomeEmail(user.email!, nameClient.full_name, nameClient.trainer_id, origin).catch(() => {});

            return NextResponse.redirect(`${origin}/my-routine`);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}

async function sendWelcomeEmail(
  clientEmail: string,
  clientName: string,
  trainerId: string,
  appOrigin: string
) {
  const admin = createAdminClient();

  const { data: trainer } = await admin
    .from("users")
    .select("full_name")
    .eq("id", trainerId)
    .single();

  const locale = getLocaleForEmail();
  const t = getEmailTranslations(locale);

  await sendEmail({
    to: clientEmail,
    subject: t.welcomeSubject,
    react: WelcomeEmail({
      clientName,
      trainerName: trainer?.full_name || "Your trainer",
      appUrl: `${appOrigin}/${locale}`,
      t,
    }),
  });
}
