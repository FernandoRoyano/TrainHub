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

  const { clientId, newPassword } = await request.json();
  if (!clientId || !newPassword) {
    return NextResponse.json(
      { error: "clientId and newPassword required" },
      { status: 400 }
    );
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return NextResponse.json(
      { error: "Mínimo 8 caracteres, una mayúscula y un número" },
      { status: 400 }
    );
  }

  // Verify the client belongs to this trainer and has a linked account
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, user_id, full_name")
    .eq("id", clientId)
    .eq("trainer_id", user.id)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!client.user_id) {
    return NextResponse.json(
      { error: "Client has no linked account" },
      { status: 400 }
    );
  }

  // Update password via admin client
  const admin = createAdminClient();
  const { error: updateError } = await admin.auth.admin.updateUserById(
    client.user_id,
    { password: newPassword }
  );

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
