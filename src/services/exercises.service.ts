import { createClient } from "@/lib/supabase/client";
import { BODY_REGION_MUSCLES, MOVEMENT_PATTERN_MUSCLES } from "@/lib/constants";
import type { ExerciseFormData } from "@/lib/validations/exercise";

export interface Exercise {
  id: string;
  trainer_id: string | null;
  name: string;
  name_es: string | null;
  slug: string | null;
  description: string | null;
  description_es: string | null;
  instructions: string | null;
  instructions_es: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  muscle_groups: string[];
  equipment: string[];
  difficulty: string | null;
  category: string | null;
  primary_muscles: string[];
  secondary_muscles: string[];
  exercise_type: string | null;
  mechanics: string | null;
  force: string | null;
  images: string[];
  source: string;
  source_id: string | null;
  is_public: boolean;
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
  body_region?: string;
  movement_pattern?: string;
  primary_muscle?: string;
  secondary_muscle?: string;
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
      .is("archived_at", null)
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
      query = query.or(
        `muscle_groups.cs.{${filters.muscle_group}},primary_muscles.cs.{${filters.muscle_group}}`
      );
    }

    if (filters?.primary_muscle) {
      query = query.contains("primary_muscles", [filters.primary_muscle]);
    }

    if (filters?.secondary_muscle) {
      query = query.contains("secondary_muscles", [filters.secondary_muscle]);
    }

    if (filters?.body_region) {
      const muscles = BODY_REGION_MUSCLES[filters.body_region];
      if (muscles) {
        const orClauses = muscles
          .map((m) => `muscle_groups.cs.{${m}},primary_muscles.cs.{${m}}`)
          .join(",");
        query = query.or(orClauses);
      }
    }

    if (filters?.movement_pattern) {
      const muscles = MOVEMENT_PATTERN_MUSCLES[filters.movement_pattern];
      if (muscles) {
        const orClauses = muscles
          .map((m) => `muscle_groups.cs.{${m}},primary_muscles.cs.{${m}}`)
          .join(",");
        query = query.or(orClauses);
      }
    }

    if (filters?.equipment) {
      query = query.contains("equipment", [filters.equipment]);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,name_es.ilike.%${filters.search}%`
      );
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
        source: "custom",
        description: data.description || null,
        instructions: data.instructions || null,
        video_url: data.video_url || null,
        thumbnail_url: data.thumbnail_url || null,
        name_es: data.name_es || null,
        primary_muscles: data.primary_muscles ?? [],
        secondary_muscles: data.secondary_muscles ?? [],
        exercise_type: data.exercise_type || null,
        mechanics: data.mechanics || null,
        force: data.force || null,
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
        name_es: data.name_es || null,
        primary_muscles: data.primary_muscles ?? undefined,
        secondary_muscles: data.secondary_muscles ?? undefined,
        exercise_type: data.exercise_type || null,
        mechanics: data.mechanics || null,
        force: data.force || null,
      })
      .eq("id", id);
    if (error) throw error;
  },

  async deleteExercise(id: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Soft delete: marca archived_at en vez de borrar la fila. Esto evita que
    // las rutinas que usan el ejercicio se queden con referencias rotas y que
    // el historial de logs del cliente pierda contexto.
    const { error } = await supabase
      .from("exercises")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id);
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
