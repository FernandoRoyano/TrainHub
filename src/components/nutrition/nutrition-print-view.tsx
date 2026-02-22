"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { MealPlan } from "@/services/nutrition.service";

interface NutritionPrintViewProps {
  mealPlan: MealPlan;
}

export function NutritionPrintView({ mealPlan }: NutritionPrintViewProps) {
  const t = useTranslations("nutrition");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${mealPlan.name} - TrainHub</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          h2 { font-size: 16px; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #111; }
          .meta { color: #666; font-size: 13px; margin-bottom: 8px; }
          .macros { display: flex; gap: 16px; margin-bottom: 16px; padding: 8px 12px; background: #f5f5f5; border-radius: 6px; font-size: 13px; }
          .macros span { font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { text-align: left; padding: 6px 8px; font-size: 13px; border-bottom: 1px solid #ddd; }
          th { font-weight: 600; background: #f5f5f5; }
          .text-right { text-align: right; }
          .subtotal { font-weight: 600; background: #fafafa; }
          .footer { margin-top: 24px; text-align: center; color: #999; font-size: 11px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <div class="footer">TrainHub - ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        {t("exportPdf")}
      </Button>

      {/* Hidden printable content */}
      <div ref={printRef} className="hidden">
        <h1>{mealPlan.name}</h1>
        {mealPlan.description && (
          <p className="meta">{mealPlan.description}</p>
        )}
        {mealPlan.goal && (
          <p className="meta">
            {t("goal")}: {t(`goal_${mealPlan.goal}` as Parameters<typeof t>[0])}
          </p>
        )}

        <div className="macros">
          {mealPlan.daily_calories != null && mealPlan.daily_calories > 0 && (
            <span>{t("calories")}: {mealPlan.daily_calories} kcal</span>
          )}
          {mealPlan.daily_protein != null && mealPlan.daily_protein > 0 && (
            <span>{t("protein")}: {mealPlan.daily_protein}g</span>
          )}
          {mealPlan.daily_carbs != null && mealPlan.daily_carbs > 0 && (
            <span>{t("carbs")}: {mealPlan.daily_carbs}g</span>
          )}
          {mealPlan.daily_fat != null && mealPlan.daily_fat > 0 && (
            <span>{t("fat")}: {mealPlan.daily_fat}g</span>
          )}
        </div>

        {(mealPlan.meals ?? []).map((meal) => {
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
            <div key={meal.id}>
              <h2>
                {meal.name}
                {meal.notes ? ` - ${meal.notes}` : ""}
              </h2>
              <table>
                <thead>
                  <tr>
                    <th>{t("foodName")}</th>
                    <th className="text-right">{t("quantity")}</th>
                    <th className="text-right">{t("calories")}</th>
                    <th className="text-right">{t("protein")}</th>
                    <th className="text-right">{t("carbs")}</th>
                    <th className="text-right">{t("fat")}</th>
                  </tr>
                </thead>
                <tbody>
                  {meal.foods.map((food) => (
                    <tr key={food.id}>
                      <td>{food.name}</td>
                      <td className="text-right">
                        {food.quantity}
                        {food.unit}
                      </td>
                      <td className="text-right">{food.calories}</td>
                      <td className="text-right">{food.protein}g</td>
                      <td className="text-right">{food.carbs}g</td>
                      <td className="text-right">{food.fat}g</td>
                    </tr>
                  ))}
                  <tr className="subtotal">
                    <td>{t("mealSubtotal")}</td>
                    <td />
                    <td className="text-right">
                      {Math.round(subtotal.calories)} kcal
                    </td>
                    <td className="text-right">
                      {Math.round(subtotal.protein)}g
                    </td>
                    <td className="text-right">
                      {Math.round(subtotal.carbs)}g
                    </td>
                    <td className="text-right">
                      {Math.round(subtotal.fat)}g
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </>
  );
}
