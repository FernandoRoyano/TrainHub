import { createClient } from "@/lib/supabase/client";

export interface Food {
  id: string;
  name: string;
  name_es: string | null;
  slug: string | null;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  source: string;
  source_id: string | null;
  is_public: boolean;
  trainer_id: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoodFilters {
  search?: string;
  category?: string;
  source?: "all" | "platform" | "mine";
  page?: number;
  pageSize?: number;
}

export const foodsService = {
  async getFoods(filters?: FoodFilters) {
    const supabase = createClient();
    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 50;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("foods")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (filters?.source === "platform") {
      query = query.is("trainer_id", null);
    } else if (filters?.source === "mine") {
      query = query.not("trainer_id", "is", null);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,name_es.ilike.%${filters.search}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data ?? []) as Food[], count: count ?? 0 };
  },

  async createFood(
    data: Omit<
      Food,
      "id" | "created_at" | "updated_at" | "source" | "source_id" | "is_public"
    >
  ) {
    const supabase = createClient();
    const { data: food, error } = await supabase
      .from("foods")
      .insert({ ...data, source: "custom", is_public: true })
      .select()
      .single();
    if (error) throw error;
    return food as Food;
  },
};
