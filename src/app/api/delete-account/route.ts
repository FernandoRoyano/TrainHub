import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteUserCompletely } from "@/lib/auth/delete-user";
import { NextResponse } from "next/server";

// Auto-baja: el usuario autenticado elimina su propia cuenta.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Confirmación explícita: el front debe reenviar el email de la cuenta.
  const { confirmEmail } = await request.json();
  if (
    typeof confirmEmail !== "string" ||
    confirmEmail.trim().toLowerCase() !== user.email?.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "Confirmation email does not match" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await deleteUserCompletely(admin, user.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
