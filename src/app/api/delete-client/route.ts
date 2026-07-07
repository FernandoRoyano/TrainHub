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
  if (!clientId || typeof clientId !== "string") {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, user_id")
    .eq("id", clientId)
    .eq("trainer_id", user.id)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Orden importante: la fila de clients primero (cascada a rutinas, chat,
  // mediciones...) y después la cuenta auth. clients.user_id no tiene ON
  // DELETE, así que borrar auth.users antes fallaría por la FK.
  const { error: deleteError } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("trainer_id", user.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (client.user_id) {
    const admin = createAdminClient();
    const { error: authError } = await admin.auth.admin.deleteUser(
      client.user_id
    );
    // La fila de clients ya no existe; si esto falla dejamos la cuenta
    // huérfana (estado previo a este endpoint) pero no bloqueamos al trainer.
    if (authError) {
      console.error("Failed to delete client auth account:", authError.message);
    }
  }

  return NextResponse.json({ success: true });
}
