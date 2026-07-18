import type { SupabaseClient } from "@supabase/supabase-js";
import { sendPushToUser } from "@/lib/push/send";

// Tipos permitidos por el CHECK de la tabla notifications (ver 00022).
export type NotificationType =
  | "routine_ending"
  | "review_reminder"
  | "routine_assigned"
  | "message"
  | "general";

export interface NotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  metadata?: Record<string, unknown>;
}

// Punto único para crear notificaciones: inserta la fila in-app (como siempre)
// y además dispara Web Push a los dispositivos del usuario. El push es
// best-effort — si falla o no está configurado, la notificación in-app se
// mantiene. Usar SIEMPRE esto en vez de admin.from("notifications").insert().
export async function createNotification(
  admin: SupabaseClient,
  n: NotificationInput
): Promise<void> {
  const { error } = await admin.from("notifications").insert({
    user_id: n.user_id,
    type: n.type,
    title: n.title,
    body: n.body ?? null,
    link: n.link ?? null,
    metadata: n.metadata ?? {},
  });

  if (error) {
    console.error("[Notification] insert error:", error);
    return;
  }

  try {
    await sendPushToUser(admin, n.user_id, {
      title: n.title,
      body: n.body ?? undefined,
      link: n.link ?? undefined,
    });
  } catch (err) {
    console.error("[Push] sendPushToUser error:", err);
  }
}
