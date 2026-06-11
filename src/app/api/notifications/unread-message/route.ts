import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send-email";
import { UnreadMessageEmail } from "@/lib/email/templates/unread-message";
import { getEmailTranslations, getLocaleForEmail } from "@/lib/email/translations";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { conversationId, messageContent } = await request.json();
    const admin = createAdminClient();

    const { data: conversation } = await admin
      .from("conversations")
      .select("id, client_id, trainer_id, last_email_notified_at")
      .eq("id", conversationId)
      .single();

    if (!conversation) return NextResponse.json({ skipped: true });

    const { data: client } = await admin
      .from("clients")
      .select("email, full_name, user_id")
      .eq("id", conversation.client_id)
      .single();

    // Seguridad: solo los participantes de la conversación pueden disparar
    // notificaciones. Sin esto, cualquier usuario autenticado podía falsificar
    // notificaciones "Nuevo mensaje de X" hacia cualquier trainer.
    const isTrainerSender = conversation.trainer_id === user.id;
    const isClientSender = client?.user_id === user.id;
    if (!isTrainerSender && !isClientSender) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: trainer } = await admin
      .from("users")
      .select("full_name")
      .eq("id", conversation.trainer_id)
      .single();

    if (isTrainerSender && client?.user_id) {
      // Notify client in-app
      await admin.from("notifications").insert({
        user_id: client.user_id,
        type: "message",
        title: `Nuevo mensaje de ${trainer?.full_name || "tu entrenador"}`,
        body: messageContent?.substring(0, 100) || "",
        link: "/my-messages",
        metadata: { conversation_id: conversationId },
      });
    } else if (!isTrainerSender) {
      // Notify trainer in-app
      await admin.from("notifications").insert({
        user_id: conversation.trainer_id,
        type: "message",
        title: `Nuevo mensaje de ${client?.full_name || "un cliente"}`,
        body: messageContent?.substring(0, 100) || "",
        link: "/messages",
        metadata: { conversation_id: conversationId },
      });
    }

    // Email notification only when trainer sends to client
    if (!isTrainerSender) {
      return NextResponse.json({ success: true, inAppOnly: true });
    }

    // Debounce: skip if email was sent less than 5 min ago
    if (conversation.last_email_notified_at) {
      const lastSent = new Date(conversation.last_email_notified_at).getTime();
      if (Date.now() - lastSent < 5 * 60 * 1000) {
        return NextResponse.json({ skipped: true, reason: "debounce" });
      }
    }

    if (!client?.email || !client.user_id) {
      return NextResponse.json({ skipped: true });
    }

    const { data: userRecord } = await admin
      .from("users")
      .select("settings")
      .eq("id", client.user_id)
      .single();

    const locale = getLocaleForEmail(
      (userRecord?.settings as Record<string, string> | null)?.locale
    );
    const t = getEmailTranslations(locale);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await sendEmail({
      to: client.email,
      subject: t.unreadMessageSubject,
      react: UnreadMessageEmail({
        clientName: client.full_name,
        trainerName: trainer?.full_name || "Your trainer",
        messagePreview: messageContent || "",
        appUrl: `${appUrl}/${locale}`,
        t,
      }),
    });

    // Update debounce timestamp
    await admin
      .from("conversations")
      .update({ last_email_notified_at: new Date().toISOString() })
      .eq("id", conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notification] unread-message error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
