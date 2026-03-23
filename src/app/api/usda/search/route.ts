import { NextRequest, NextResponse } from "next/server";

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

interface UsdaNutrient {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
}

interface UsdaFood {
  fdcId: number;
  description: string;
  dataType: string;
  brandName?: string;
  foodNutrients: UsdaNutrient[];
}

function extractNutrient(nutrients: UsdaNutrient[], id: number): number {
  return Math.round((nutrients.find((n) => n.nutrientId === id)?.value ?? 0) * 10) / 10;
}

// Map USDA food categories to our categories
function mapCategory(dataType: string): string {
  // USDA doesn't provide clean categories, default to "other"
  if (dataType === "Branded") return "other";
  return "other";
}

export async function GET(request: NextRequest) {
  if (!USDA_API_KEY) {
    return NextResponse.json(
      { error: "USDA API key not configured" },
      { status: 500 }
    );
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ foods: [] });
  }

  try {
    const params = new URLSearchParams({
      api_key: USDA_API_KEY,
      query: query.trim(),
      pageSize: "25",
      dataType: "Foundation,SR Legacy",
    });

    const res = await fetch(`${USDA_BASE_URL}/foods/search?${params}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "USDA API error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const foods = (data.foods ?? []).map((food: UsdaFood) => ({
      fdcId: food.fdcId,
      name: food.description,
      brandName: food.brandName || null,
      category: mapCategory(food.dataType),
      calories_per_100g: extractNutrient(food.foodNutrients, 1008), // Energy
      protein_per_100g: extractNutrient(food.foodNutrients, 1003),  // Protein
      carbs_per_100g: extractNutrient(food.foodNutrients, 1005),    // Carbs
      fat_per_100g: extractNutrient(food.foodNutrients, 1004),      // Fat
    }));

    return NextResponse.json({ foods });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from USDA" },
      { status: 500 }
    );
  }
}
