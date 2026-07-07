import type { SupabaseClient } from "@supabase/supabase-js";

// Baja completa de una cuenta. Reglas por rol:
// - Trainer: se borra su auth user (cascada: users → clients y todos sus
//   datos) y después las cuentas auth de sus clientes vinculados, que sin
//   entrenador quedarían huérfanas y sin acceso a nada.
// - Client: se desvincula de la fila de clients (el trainer conserva el
//   historial) y se borra solo su cuenta auth.
// clients.user_id no tiene ON DELETE, así que el orden importa: nunca se
// puede borrar un auth user mientras una fila de clients lo referencie.
export async function deleteUserCompletely(
  admin: SupabaseClient,
  userId: string
): Promise<{ error: string | null }> {
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { error: "User not found" };
  }

  if (profile.role === "client") {
    const { error: unlinkError } = await admin
      .from("clients")
      .update({ user_id: null, status: "inactive" })
      .eq("user_id", userId);
    if (unlinkError) return { error: unlinkError.message };

    const { error } = await admin.auth.admin.deleteUser(userId);
    return { error: error?.message ?? null };
  }

  // Trainer (o admin): recoger las cuentas de sus clientes antes de que la
  // cascada borre las filas de clients que las referencian.
  const { data: linkedClients } = await admin
    .from("clients")
    .select("user_id")
    .eq("trainer_id", userId)
    .not("user_id", "is", null);

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) return { error: deleteError.message };

  for (const c of linkedClients ?? []) {
    if (!c.user_id) continue;
    const { error } = await admin.auth.admin.deleteUser(c.user_id);
    if (error) {
      // No abortamos: el trainer ya no existe; registramos y seguimos.
      console.error(
        `Failed to delete linked client account ${c.user_id}:`,
        error.message
      );
    }
  }

  return { error: null };
}
