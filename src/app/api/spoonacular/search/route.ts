import { NextRequest, NextResponse } from "next/server";
import { translateFoodName } from "@/lib/food-translations";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";
const IMG_BASE = "https://img.spoonacular.com/ingredients_250x250";

interface SpoonIngredient {
  id: number;
  name: string;
  image: string;
  nutrition?: {
    nutrients: { name: string; amount: number; unit: string }[];
  };
}

function extractNutrient(nutrients: { name: string; amount: number }[], name: string): number {
  return Math.round((nutrients.find((n) => n.name === name)?.amount ?? 0) * 10) / 10;
}

export async function GET(request: NextRequest) {
  if (!SPOONACULAR_API_KEY) {
    return NextResponse.json(
      { error: "Spoonacular API key not configured" },
      { status: 500 }
    );
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ foods: [] });
  }

  try {
    // Search ingredients (foods) with nutrition data
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query: query.trim(),
      number: "20",
      metaInformation: "true",
    });

    const res = await fetch(
      `${BASE_URL}/food/ingredients/search?${params}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Spoonacular API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const ingredients: SpoonIngredient[] = data.results ?? [];

    // Fetch nutrition for each ingredient (batch — max 20)
    const foods = await Promise.all(
      ingredients.map(async (ing) => {
        try {
          const nutRes = await fetch(
            `${BASE_URL}/food/ingredients/${ing.id}/information?apiKey=${SPOONACULAR_API_KEY}&amount=100&unit=g`,
            { next: { revalidate: 86400 } } // cache 24h
          );
          if (!nutRes.ok) {
            return {
              spoonId: ing.id,
              name: ing.name,
              name_es: translateFoodName(ing.name),
              image_url: ing.image ? `${IMG_BASE}/${ing.image}` : null,
              category: "other",
              calories_per_100g: 0,
              protein_per_100g: 0,
              carbs_per_100g: 0,
              fat_per_100g: 0,
            };
          }
          const nutData = await nutRes.json();
          const nutrients = nutData.nutrition?.nutrients ?? [];

          return {
            spoonId: ing.id,
            name: ing.name,
            name_es: translateFoodName(ing.name),
            image_url: ing.image ? `${IMG_BASE}/${ing.image}` : null,
            category: mapCategory(nutData.aisle),
            calories_per_100g: extractNutrient(nutrients, "Calories"),
            protein_per_100g: extractNutrient(nutrients, "Protein"),
            carbs_per_100g: extractNutrient(nutrients, "Carbohydrates"),
            fat_per_100g: extractNutrient(nutrients, "Fat"),
          };
        } catch {
          return {
            spoonId: ing.id,
            name: ing.name,
            image_url: ing.image ? `${IMG_BASE}/${ing.image}` : null,
            category: "other",
            calories_per_100g: 0,
            protein_per_100g: 0,
            carbs_per_100g: 0,
            fat_per_100g: 0,
          };
        }
      })
    );

    return NextResponse.json({ foods });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from Spoonacular" },
      { status: 500 }
    );
  }
}

function mapCategory(aisle: string | null): string {
  if (!aisle) return "other";
  const a = aisle.toLowerCase();
  if (a.includes("meat") || a.includes("seafood") || a.includes("chicken") || a.includes("fish")) return "protein";
  if (a.includes("dairy") || a.includes("milk") || a.includes("cheese")) return "dairy";
  if (a.includes("bread") || a.includes("pasta") || a.includes("cereal") || a.includes("grain") || a.includes("rice")) return "grain";
  if (a.includes("vegetable") || a.includes("produce")) return "vegetable";
  if (a.includes("fruit")) return "fruit";
  if (a.includes("bean") || a.includes("legume") || a.includes("lentil")) return "legume";
  if (a.includes("nut") || a.includes("seed")) return "nut_seed";
  if (a.includes("oil") || a.includes("fat") || a.includes("butter")) return "oil_fat";
  if (a.includes("beverage") || a.includes("drink") || a.includes("juice")) return "beverage";
  if (a.includes("spice") || a.includes("sauce") || a.includes("condiment")) return "condiment";
  if (a.includes("snack") || a.includes("chip") || a.includes("cookie")) return "snack";
  return "other";
}
