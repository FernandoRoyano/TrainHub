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

    // Only notify when the trainer is the sender
    if (conversation.trainer_id !== user.id) {
      return NextResponse.json({ skipped: true });
    }

    // Debounce: skip if email was sent less than 5 min ago
    if (conversation.last_email_notified_at) {
      const lastSent = new Date(conversation.last_email_notified_at).getTime();
      if (Date.now() - lastSent < 5 * 60 * 1000) {
        return NextResponse.json({ skipped: true, reason: "debounce" });
      }
    }

    const { data: client } = await admin
      .from("clients")
      .select("email, full_name, user_id")
      .eq("id", conversation.client_id)
      .single();

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

    const { data: trainer } = await admin
      .from("users")
      .select("full_name")
      .eq("id", conversation.trainer_id)
      .single();

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
