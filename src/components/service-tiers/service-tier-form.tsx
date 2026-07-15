"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  createServiceTierSchema,
  FEATURE_KEYS,
  type ServiceTierFormData,
} from "@/lib/validations/service-tier";
import {
  useCreateServiceTier,
  useUpdateServiceTier,
} from "@/hooks/use-service-tiers";
import type { ServiceTier } from "@/services/service-tiers.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ServiceTierFormProps {
  mode: "create" | "edit";
  tier?: ServiceTier;
}

const DEFAULT_FEATURES: ServiceTierFormData["features"] = {
  training: true,
  nutrition: false,
  messaging: false,
  progress_tracking: false,
  measurements: false,
  checkins: false,
  questionnaires: false,
};

export function ServiceTierForm({ mode, tier }: ServiceTierFormProps) {
  const t = useTranslations("serviceTiers");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();

  const createTier = useCreateServiceTier();
  const updateTier = useUpdateServiceTier();

  const schema = createServiceTierSchema(tv);

  const form = useForm<ServiceTierFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: tier?.name ?? "",
      description: tier?.description ?? "",
      color: tier?.color ?? "#6366f1",
      price: tier?.price ?? undefined,
      currency: tier?.currency ?? "EUR",
      billing_interval:
        (tier?.billing_interval as ServiceTierFormData["billing_interval"]) ??
        "monthly",
      features: tier?.features ?? DEFAULT_FEATURES,
      max_revisions_per_month: tier?.max_revisions_per_month ?? undefined,
      is_active: tier?.is_active ?? true,
    },
  });

  const onSubmit = (data: ServiceTierFormData) => {
    if (mode === "edit" && tier) {
      updateTier.mutate(
        { id: tier.id, data },
        { onSuccess: () => router.push("/service-tiers") },
      );
    } else {
      createTier.mutate(data, {
        onSuccess: () => router.push("/service-tiers"),
      });
    }
  };

  const isPending = createTier.isPending || updateTier.isPending;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/service-tiers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="font-display text-2xl font-bold">
          {mode === "create" ? t("addTier") : t("editTier")}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* General info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("generalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("namePlaceholder")}
                        {...field}
                      />
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
                      <Textarea
                        placeholder={t("descriptionPlaceholder")}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("color")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="#6366f1"
                            {...field}
                            className="flex-1"
                          />
                          <div
                            className="h-9 w-9 rounded-md border shrink-0"
                            style={{
                              backgroundColor: field.value || "#6366f1",
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2 rounded-lg border p-3">
                      <FormLabel className="mb-0">{tc("active")}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Revisiones */}
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="max_revisions_per_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("maxRevisions")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        className="max-w-xs"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>{t("features")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {FEATURE_KEYS.map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`features.${key}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-2 rounded-lg border p-3">
                      <FormLabel className="mb-0">
                        {t(`feature_${key}`)}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/service-tiers">{tc("cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? tc("loading") : tc("save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
