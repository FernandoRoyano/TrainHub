import { createClient } from "@/lib/supabase/client";
import type { ExerciseFormData } from "@/lib/validations/exercise";

export interface Exercise {
  id: string;
  trainer_id: string | null;
  name: string;
  description: string | null;
  instructions: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  muscle_groups: string[];
  equipment: string[];
  difficulty: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilters {
  search?: string;
  muscle_group?: string;
  equipment?: string;
  difficulty?: string;
  category?: string;
  source?: "all" | "platform" | "mine";
  page?: number;
  pageSize?: number;
}

export const exercisesService = {
  async getExercises(filters?: ExerciseFilters) {
    const supabase = createClient();
    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("exercises")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (filters?.source === "platform") {
      query = query.is("trainer_id", null);
    } else if (filters?.source === "mine") {
      query = query.not("trainer_id", "is", null);
    }

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.muscle_group) {
      query = query.contains("muscle_groups", [filters.muscle_group]);
    }

    if (filters?.equipment) {
      query = query.contains("equipment", [filters.equipment]);
    }

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as Exercise[], count: count ?? 0 };
  },

  async getExerciseById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Exercise;
  },

  async createExercise(data: ExerciseFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: exercise, error } = await supabase
      .from("exercises")
      .insert({
        ...data,
        trainer_id: user.id,
        description: data.description || null,
        instructions: data.instructions || null,
        video_url: data.video_url || null,
        thumbnail_url: data.thumbnail_url || null,
      })
      .select()
      .single();
    if (error) throw error;
    return exercise as Exercise;
  },

  async updateExercise(id: string, data: Partial<ExerciseFormData>) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("exercises")
      .update({
        ...data,
        description: data.description || null,
        instructions: data.instructions || null,
        video_url: data.video_url || null,
        thumbnail_url: data.thumbnail_url || null,
      })
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async deleteExercise(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", id)
      .eq("trainer_id", user.id);
    if (error) throw error;
  },

  async uploadMedia(file: File, folder: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("exercises")
      .upload(path, file, { upsert: true });
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("exercises").getPublicUrl(path);
    return publicUrl;
  },
};
