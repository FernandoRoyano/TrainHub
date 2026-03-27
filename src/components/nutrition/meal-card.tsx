"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MealPlanMeal } from "@/services/nutrition.service";

interface MealCardProps {
  meal: MealPlanMeal;
  showCalories?: boolean;
}

export function MealCard({ meal, showCalories = true }: MealCardProps) {
  const t = useTranslations("nutrition");
  const locale = useLocale();

  const subtotal = meal.foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{meal.name}</CardTitle>
          <Badge variant="outline" className="text-xs capitalize">
            {t(`meal_${meal.meal_type}` as Parameters<typeof t>[0])}
          </Badge>
        </div>
        {meal.notes && (
          <p className="text-xs text-muted-foreground">{meal.notes}</p>
        )}
      </CardHeader>
      <CardContent>
        {meal.foods.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noFoodsInMeal")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">{t("foodName")}</th>
                  <th className="pb-2 pr-3 font-medium text-right">
                    {t("quantity")}
                  </th>
                  {showCalories && (
                    <th className="pb-2 pr-3 font-medium text-right">
                      {t("calories")}
                    </th>
                  )}
                  <th className="pb-2 pr-3 font-medium text-right">
                    {t("protein")}
                  </th>
                  <th className="pb-2 pr-3 font-medium text-right">
                    {t("carbs")}
                  </th>
                  <th className="pb-2 font-medium text-right">{t("fat")}</th>
                </tr>
              </thead>
              <tbody>
                {meal.foods.map((food) => (
                  <tr key={food.id} className="border-b border-border/50">
                    <td className="py-1.5 pr-3 font-medium">{(locale === "es" && food.name_es) ? food.name_es : food.name}</td>
                    <td className="py-1.5 pr-3 text-right text-muted-foreground">
                      {food.quantity}
                      {food.unit}
                    </td>
                    {showCalories && (
                      <td className="py-1.5 pr-3 text-right">
                        {food.calories}
                      </td>
                    )}
                    <td className="py-1.5 pr-3 text-right text-blue-400">
                      {food.protein}g
                    </td>
                    <td className="py-1.5 pr-3 text-right text-yellow-400">
                      {food.carbs}g
                    </td>
                    <td className="py-1.5 text-right text-red-400">
                      {food.fat}g
                    </td>
                  </tr>
                ))}
                {/* Subtotal row */}
                <tr className="font-semibold text-xs">
                  <td className="pt-2 pr-3">{t("mealSubtotal")}</td>
                  <td className="pt-2 pr-3" />
                  {showCalories && (
                    <td className="pt-2 pr-3 text-right">
                      {Math.round(subtotal.calories)} kcal
                    </td>
                  )}
                  <td className="pt-2 pr-3 text-right text-blue-400">
                    {Math.round(subtotal.protein)}g
                  </td>
                  <td className="pt-2 pr-3 text-right text-yellow-400">
                    {Math.round(subtotal.carbs)}g
                  </td>
                  <td className="pt-2 text-right text-red-400">
                    {Math.round(subtotal.fat)}g
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
