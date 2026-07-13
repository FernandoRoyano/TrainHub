import { createClient } from "@/lib/supabase/client";

export interface Conversation {
  id: string;
  trainer_id: string;
  client_id: string;
  last_message_at: string;
  created_at: string;
  client?: {
    id: string;
    full_name: string;
    email: string | null;
  };
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

async function verifyConversationAccess(
  supabase: ReturnType<typeof createClient>,
  conversationId: string,
  userId: string
): Promise<void> {
  // Check as trainer
  const { data: asTrainer } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("trainer_id", userId)
    .maybeSingle();
  if (asTrainer) return;

  // Check as client
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (client) {
    const { data: asClient } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("client_id", client.id)
      .maybeSingle();
    if (asClient) return;
  }

  throw new Error("Not authorized");
}

export const messagesService = {
  async getConversations() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Embed con límite por conversación: trae solo el último mensaje de cada una
    const { data, error } = await supabase
      .from("conversations")
      .select(
        "*, client:clients(id, full_name, email), last_message:messages(id, conversation_id, sender_id, content, read, created_at)"
      )
      .eq("trainer_id", user.id)
      .order("last_message_at", { ascending: false })
      .order("created_at", { referencedTable: "messages", ascending: false })
      .limit(1, { referencedTable: "messages" });
    if (error) throw error;

    const conversations = (data ?? []).map((conv) => ({
      ...conv,
      last_message: Array.isArray(conv.last_message)
        ? (conv.last_message[0] as Message | undefined)
        : (conv.last_message as Message | undefined),
    })) as Conversation[];
    if (conversations.length === 0) return conversations;

    const convIds = conversations.map((c) => c.id);

    // Solo filas no leídas: acotado por naturaleza
    const { data: unreadRows } = await supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", convIds)
      .eq("read", false)
      .neq("sender_id", user.id);

    const unreadMap = new Map<string, number>();
    for (const row of unreadRows ?? []) {
      const cid = row.conversation_id;
      unreadMap.set(cid, (unreadMap.get(cid) ?? 0) + 1);
    }

    for (const conv of conversations) {
      conv.unread_count = unreadMap.get(conv.id) ?? 0;
    }

    return conversations;
  },

  async getOrCreateConversation(clientId: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Verify client belongs to this trainer
    const { data: clientCheck } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("trainer_id", user.id)
      .maybeSingle();
    if (!clientCheck) throw new Error("Client not found");

    // Try to find existing
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("trainer_id", user.id)
      .eq("client_id", clientId)
      .maybeSingle();

    if (existing) return existing as Conversation;

    // Create new
    const { data, error } = await supabase
      .from("conversations")
      .insert({ trainer_id: user.id, client_id: clientId })
      .select()
      .single();
    if (error) throw error;
    return data as Conversation;
  },

  async getMessages(conversationId: string, page = 0) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    await verifyConversationAccess(supabase, conversationId, user.id);

    const pageSize = 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) throw error;
    return (data as Message[]).reverse();
  },

  async sendMessage(conversationId: string, content: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    await verifyConversationAccess(supabase, conversationId, user.id);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();
    if (error) throw error;

    // Update conversation last_message_at — si falla, el orden de
    // conversaciones y la vista previa quedan obsoletos: no silenciarlo
    const { error: tsError } = await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
    if (tsError) console.error("[messages] last_message_at update failed:", tsError.message);

    return data as Message;
  },

  async markAsRead(conversationId: string) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    await verifyConversationAccess(supabase, conversationId, user.id);

    // Si falla (p. ej. RLS), el badge de no-leídos no se limpia: propagar para
    // que el hook no invalide la caché como si hubiera funcionado
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .eq("read", false)
      .neq("sender_id", user.id);
    if (error) throw error;
  },

  async getClientConversation() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    // Find client record
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!client) return null;

    // Find conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle();

    return conv as Conversation | null;
  },

  subscribeToMessages(
    conversationId: string,
    onMessage: (message: Message) => void
  ) {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
