import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this user is a client (link user_id if needed)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        // Try linking by email match
        const { data: client } = await supabase
          .from("clients")
          .select("id, user_id")
          .eq("email", user.email)
          .is("user_id", null)
          .maybeSingle();

        if (client) {
          await supabase
            .from("clients")
            .update({ user_id: user.id, status: "active", invite_token: null })
            .eq("id", client.id);

          await supabase
            .from("users")
            .update({ role: "client" })
            .eq("id", user.id);

          return NextResponse.redirect(`${origin}/my-routine`);
        }

        // Try linking by invite_token (shareable link flow)
        const inviteToken = user.user_metadata?.invite_token;
        if (inviteToken) {
          const { data: tokenClient } = await supabase
            .from("clients")
            .select("id")
            .eq("invite_token", inviteToken)
            .is("user_id", null)
            .maybeSingle();

          if (tokenClient) {
            await supabase
              .from("clients")
              .update({
                user_id: user.id,
                status: "active",
                invite_token: null,
                email: user.email,
              })
              .eq("id", tokenClient.id);

            await supabase
              .from("users")
              .update({ role: "client" })
              .eq("id", user.id);

            return NextResponse.redirect(`${origin}/my-routine`);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
