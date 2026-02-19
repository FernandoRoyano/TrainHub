import { createClient } from "@/lib/supabase/client";

export interface SessionNote {
  id: string;
  trainer_id: string;
  client_id: string;
  date: string;
  title: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const sessionNotesService = {
  async getNotes(clientId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("session_notes")
      .select("*")
      .eq("client_id", clientId)
      .eq("trainer_id", user.id)
      .order("date", { ascending: false });
    if (error) throw error;
    return data as SessionNote[];
  },

  async createNote(data: {
    client_id: string;
    date: string;
    title?: string;
    content: string;
    tags?: string[];
  }) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: note, error } = await supabase
      .from("session_notes")
      .insert({
        trainer_id: user.id,
        client_id: data.client_id,
        date: data.date,
        title: data.title || null,
        content: data.content,
        tags: data.tags ?? [],
      })
      .select()
      .single();
    if (error) throw error;
    return note as SessionNote;
  },

  async updateNote(
    id: string,
    data: { title?: string; content?: string; tags?: string[] }
  ) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("session_notes")
      .update(data)
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async deleteNote(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("session_notes")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },
};
