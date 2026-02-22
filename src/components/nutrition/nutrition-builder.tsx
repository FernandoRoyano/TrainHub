"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  createMealPlanSchema,
  type MealPlanFormData,
} from "@/lib/validations/nutrition";
import { useCreateMealPlan, useUpdateMealPlan } from "@/hooks/use-nutrition";
import {
  useNutritionBuilderStore,
  type BuilderFood,
} from "@/stores/nutrition-builder-store";
import type { MealPlan } from "@/services/nutrition.service";
import { MEAL_TYPES, FOOD_UNITS, NUTRITION_GOALS } from "@/lib/constants";
import { MacroSummary } from "./macro-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

interface NutritionBuilderProps {
  mode: "create" | "edit";
  mealPlan?: MealPlan;
}

export function NutritionBuilder({ mode, mealPlan }: NutritionBuilderProps) {
  const t = useTranslations("nutrition");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();
  const createMealPlan = useCreateMealPlan();
  const updateMealPlan = useUpdateMealPlan();

  const {
    meals,
    activeMealIndex,
    setMeals,
    addMeal,
    removeMeal,
    updateMeal,
    setActiveMealIndex,
    addFood,
    removeFood,
    updateFood,
    getTotalMacros,
    reset,
  } = useNutritionBuilderStore();

  const form = useForm<MealPlanFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMealPlanSchema(tv)) as any,
    defaultValues: {
      name: mealPlan?.name ?? "",
      description: mealPlan?.description ?? "",
      goal: (mealPlan?.goal as MealPlanFormData["goal"]) ?? "maintenance",
      daily_calories: mealPlan?.daily_calories ?? undefined,
      daily_protein: mealPlan?.daily_protein ?? undefined,
      daily_carbs: mealPlan?.daily_carbs ?? undefined,
      daily_fat: mealPlan?.daily_fat ?? undefined,
      is_template: mealPlan?.is_template ?? false,
      meals: [],
    },
  });

  // Load existing meal plan data into the store
  useEffect(() => {
    if (mealPlan?.meals && mealPlan.meals.length > 0) {
      const builderMeals = mealPlan.meals.map((meal) => ({
        id: `loaded_${meal.id}`,
        name: meal.name,
        meal_type: meal.meal_type,
        order_index: meal.order_index,
        notes: meal.notes ?? "",
        foods: meal.foods.map((food) => ({
          id: `loaded_${food.id}`,
          name: food.name,
          quantity: food.quantity,
          unit: food.unit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          order_index: food.order_index,
          notes: food.notes ?? "",
        })),
      }));
      setMeals(builderMeals);
    } else {
      reset();
    }
    return () => reset();
  }, [mealPlan, setMeals, reset]);

  const isLoading = createMealPlan.isPending || updateMealPlan.isPending;
  const activeMeal = meals[activeMealIndex];
  const totalMacros = getTotalMacros();

  const onSubmit = useCallback(
    (formData: MealPlanFormData) => {
      const fullData: MealPlanFormData = {
        ...formData,
        meals: meals.map((meal) => ({
          name: meal.name || t("unnamedMeal"),
          meal_type: meal.meal_type as MealPlanFormData["meals"][number]["meal_type"],
          order_index: meal.order_index,
          notes: meal.notes,
          foods: meal.foods.map((food) => ({
            name: food.name || t("unnamedFood"),
            quantity: food.quantity,
            unit: food.unit as MealPlanFormData["meals"][number]["foods"][number]["unit"],
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            order_index: food.order_index,
            notes: food.notes,
          })),
        })),
      };

      if (mode === "create") {
        createMealPlan.mutate(fullData, {
          onSuccess: () => router.push("/nutrition"),
        });
      } else if (mealPlan) {
        updateMealPlan.mutate(
          { id: mealPlan.id, data: fullData },
          { onSuccess: () => router.push(`/nutrition/${mealPlan.id}`) }
        );
      }
    },
    [meals, mode, mealPlan, createMealPlan, updateMealPlan, router, t]
  );

  const handleAddMealWithType = (mealType: string) => {
    addMeal();
    const newIndex = meals.length;
    // Update the meal type after adding
    setTimeout(() => {
      updateMeal(newIndex, {
        meal_type: mealType,
        name: t(`meal_${mealType}` as Parameters<typeof t>[0]),
      });
    }, 0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/nutrition">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? t("addPlan") : t("editPlan")}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("metadata")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("mealPlanNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("goal")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {NUTRITION_GOALS.map((g) => (
                            <SelectItem key={g} value={g}>
                              {t(`goal_${g}` as Parameters<typeof t>[0])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="daily_calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dailyCalories")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="2000"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? undefined : parseInt(val) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dailyProtein")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="150"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? undefined : parseFloat(val) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dailyCarbs")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="200"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? undefined : parseFloat(val) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("dailyFat")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="65"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? undefined : parseFloat(val) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_template"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm">{t("isTemplate")}</span>
                    </label>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Builder Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("builder")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meal selector tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {meals.map((meal, i) => (
                  <Button
                    key={meal.id}
                    type="button"
                    variant={i === activeMealIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveMealIndex(i)}
                    className="shrink-0"
                  >
                    {meal.name || t(`meal_${meal.meal_type}` as Parameters<typeof t>[0])}
                  </Button>
                ))}
                <DropdownMealAdd
                  t={t}
                  onSelect={handleAddMealWithType}
                />
              </div>

              {/* Active Meal Editor */}
              {activeMeal && (
                <div className="space-y-3">
                  {/* Meal config */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("mealName")}
                      value={activeMeal.name}
                      onChange={(e) =>
                        updateMeal(activeMealIndex, { name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Select
                      value={activeMeal.meal_type}
                      onValueChange={(value) =>
                        updateMeal(activeMealIndex, { meal_type: value })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEAL_TYPES.map((mt) => (
                          <SelectItem key={mt} value={mt}>
                            {t(`meal_${mt}` as Parameters<typeof t>[0])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {meals.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive shrink-0"
                        onClick={() => removeMeal(activeMealIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Textarea
                    placeholder={t("mealNotes")}
                    value={activeMeal.notes}
                    onChange={(e) =>
                      updateMeal(activeMealIndex, { notes: e.target.value })
                    }
                    rows={2}
                  />

                  {/* Foods list */}
                  {activeMeal.foods.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg border-dashed">
                      {t("noFoodsInMeal")}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Foods header */}
                      <div className="hidden sm:grid sm:grid-cols-[1fr_80px_80px_70px_70px_70px_70px_32px] gap-1.5 text-xs text-muted-foreground px-1">
                        <span>{t("foodName")}</span>
                        <span>{t("quantity")}</span>
                        <span>{t("unit")}</span>
                        <span>{t("calories")}</span>
                        <span>{t("protein")}</span>
                        <span>{t("carbs")}</span>
                        <span>{t("fat")}</span>
                        <span />
                      </div>

                      {activeMeal.foods.map((food, foodIndex) => (
                        <FoodRow
                          key={food.id}
                          food={food}
                          mealIndex={activeMealIndex}
                          foodIndex={foodIndex}
                          t={t}
                          updateFood={updateFood}
                          removeFood={removeFood}
                        />
                      ))}
                    </div>
                  )}

                  {/* Add food button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => addFood(activeMealIndex)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("addFood")}
                  </Button>
                </div>
              )}

              {/* Live macro summary */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">{t("macroSummary")}</p>
                <MacroSummary
                  calories={totalMacros.calories}
                  protein={totalMacros.protein}
                  carbs={totalMacros.carbs}
                  fat={totalMacros.fat}
                  targetCalories={form.watch("daily_calories")}
                  targetProtein={form.watch("daily_protein")}
                  targetCarbs={form.watch("daily_carbs")}
                  targetFat={form.watch("daily_fat")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/nutrition">{tc("cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tc("save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* ── Inline food row ────────────────────────────────────── */
function FoodRow({
  food,
  mealIndex,
  foodIndex,
  t,
  updateFood,
  removeFood,
}: {
  food: BuilderFood;
  mealIndex: number;
  foodIndex: number;
  t: ReturnType<typeof useTranslations>;
  updateFood: (mi: number, fi: number, data: Partial<BuilderFood>) => void;
  removeFood: (mi: number, fi: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-[1fr_80px_80px_70px_70px_70px_70px_32px] gap-1.5 items-center border rounded-lg p-2 sm:p-1.5">
      {/* Food name */}
      <Input
        placeholder={t("foodName")}
        value={food.name}
        onChange={(e) =>
          updateFood(mealIndex, foodIndex, { name: e.target.value })
        }
        className="h-8 text-sm col-span-2 sm:col-span-1"
      />

      {/* Quantity */}
      <Input
        type="number"
        min={0}
        step="any"
        value={food.quantity}
        onChange={(e) =>
          updateFood(mealIndex, foodIndex, {
            quantity: parseFloat(e.target.value) || 0,
          })
        }
        className="h-8 text-sm"
        placeholder={t("quantity") as string}
      />

      {/* Unit */}
      <Select
        value={food.unit}
        onValueChange={(value) =>
          updateFood(mealIndex, foodIndex, { unit: value })
        }
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FOOD_UNITS.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Calories */}
      <Input
        type="number"
        min={0}
        value={food.calories}
        onChange={(e) =>
          updateFood(mealIndex, foodIndex, {
            calories: parseInt(e.target.value) || 0,
          })
        }
        className="h-8 text-sm"
        placeholder="kcal"
      />

      {/* Protein */}
      <Input
        type="number"
        min={0}
        step="any"
        value={food.protein}
        onChange={(e) =>
          updateFood(mealIndex, foodIndex, {
            protein: parseFloat(e.target.value) || 0,
          })
        }
        className="h-8 text-sm"
        placeholder="P"
      />

      {/* Carbs */}
      <Input
        type="number"
        min={0}
        step="any"
        value={food.carbs}
        onChange={(e) =>
          updateFood(mealIndex, foodIndex, {
            carbs: parseFloat(e.target.value) || 0,
          })
        }
        className="h-8 text-sm"
        placeholder="C"
      />

      {/* Fat */}
      <Input
        type="number"
        min={0}
        step="any"
        value={food.fat}
        onChange={(e) =>
          updateFood(mealIndex, foodIndex, {
            fat: parseFloat(e.target.value) || 0,
          })
        }
        className="h-8 text-sm"
        placeholder="F"
      />

      {/* Delete */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => removeFood(mealIndex, foodIndex)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ── Add meal dropdown ─────────────────────────────────── */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DropdownMealAdd({
  t,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
  onSelect: (mealType: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          {t("addMeal")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {MEAL_TYPES.map((mt) => (
          <DropdownMenuItem key={mt} onClick={() => onSelect(mt)}>
            {t(`meal_${mt}` as Parameters<typeof t>[0])}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
