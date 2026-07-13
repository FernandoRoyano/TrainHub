import { createClient } from "@/lib/supabase/client";
import type { BlockFormData } from "@/lib/validations/block";
import type { Exercise } from "./exercises.service";

export interface BlockExercise {
  id: string;
  block_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string | null;
  superset_group: number | null;
  exercise?: Exercise;
}

export interface ExerciseBlock {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  block_type: string;
  color: string | null;
  created_at: string;
  updated_at: string;
  exercises?: BlockExercise[];
}

export interface BlockFilters {
  search?: string;
  block_type?: string;
  page?: number;
  pageSize?: number;
}

export const blocksService = {
  async getBlocks(filters?: BlockFilters) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("exercise_blocks")
      .select("*, block_exercises(count)", { count: "exact" })
      .eq("trainer_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters?.block_type) {
      query = query.eq("block_type", filters.block_type);
    }
    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: (data ?? []) as ExerciseBlock[], count: count ?? 0 };
  },

  async getBlockById(id: string) {
    const supabase = createClient();

    const { data: block, error: blockError } = await supabase
      .from("exercise_blocks")
      .select("*")
      .eq("id", id)
      .single();
    if (blockError) throw blockError;

    const { data: exercises, error: exError } = await supabase
      .from("block_exercises")
      .select("*, exercise:exercises(*)")
      .eq("block_id", id)
      .order("order_index", { ascending: true });
    if (exError) throw exError;

    return {
      ...block,
      exercises: (exercises ?? []) as BlockExercise[],
    } as ExerciseBlock;
  },

  async createBlock(data: BlockFormData) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Not authenticated");

    const { data: block, error: blockError } = await supabase
      .from("exercise_blocks")
      .insert({
        trainer_id: user.id,
        name: data.name,
        description: data.description || null,
        block_type: data.block_type,
        color: data.color || null,
      })
      .select()
      .single();
    if (blockError) throw blockError;

    if (data.exercises.length > 0) {
      const exercisesToInsert = data.exercises.map((ex) => ({
        block_id: block.id,
        exercise_id: ex.exercise_id,
        order_index: ex.order_index,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes || null,
        superset_group: ex.superset_group ?? null,
      }));

      const { error: exError } = await supabase
        .from("block_exercises")
        .insert(exercisesToInsert);
      if (exError) throw exError;
    }

    return block as ExerciseBlock;
  },

  async updateBlock(id: string, data: BlockFormData) {
    const supabase = createClient();

    const { error: blockError } = await supabase
      .from("exercise_blocks")
      .update({
        name: data.name,
        description: data.description || null,
        block_type: data.block_type,
        color: data.color || null,
      })
      .eq("id", id);
    if (blockError) throw blockError;

    const { error: deleteError } = await supabase
      .from("block_exercises")
      .delete()
      .eq("block_id", id);
    if (deleteError) throw deleteError;

    if (data.exercises.length > 0) {
      const exercisesToInsert = data.exercises.map((ex) => ({
        block_id: id,
        exercise_id: ex.exercise_id,
        order_index: ex.order_index,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes || null,
        superset_group: ex.superset_group ?? null,
      }));

      const { error: exError } = await supabase
        .from("block_exercises")
        .insert(exercisesToInsert);
      if (exError) throw exError;
    }
  },

  async deleteBlock(id: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from("exercise_blocks")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
