"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClientSchema, type ClientFormData } from "@/lib/validations/client";
import { useCreateClient, useUpdateClient } from "@/hooks/use-clients";
import type { Client } from "@/services/clients.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ClientFormProps {
  mode: "create" | "edit";
  client?: Client;
}

export function ClientForm({ mode, client }: ClientFormProps) {
  const t = useTranslations("clients");
  const tc = useTranslations("common");
  const tv = useTranslations("validation");
  const router = useRouter();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const profileData = (client?.profile_data ?? {}) as Record<string, unknown>;

  const form = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema(tv)),
    defaultValues: {
      full_name: client?.full_name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      status: (client?.status as ClientFormData["status"]) ?? "active",
      tags: client?.tags ?? [],
      notes: client?.notes ?? "",
      profile_data: {
        weight: (profileData.weight as number) ?? undefined,
        height: (profileData.height as number) ?? undefined,
        birth_date: (profileData.birth_date as string) ?? "",
        goals: (profileData.goals as string) ?? "",
        injuries: (profileData.injuries as string) ?? "",
        medical_notes: (profileData.medical_notes as string) ?? "",
      },
    },
  });

  const isLoading = createClient.isPending || updateClient.isPending;

  async function onSubmit(data: ClientFormData) {
    if (mode === "create") {
      createClient.mutate(data, {
        onSuccess: () => router.push("/clients"),
      });
    } else if (client) {
      updateClient.mutate(
        { id: client.id, data },
        { onSuccess: () => router.push(`/clients/${client.id}`) }
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? t("addClient") : t("editClient")}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">{t("name")}</TabsTrigger>
              <TabsTrigger value="physical">{t("physicalData")}</TabsTrigger>
              <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("namePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phone")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("phonePlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("status")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">{tc("active")}</SelectItem>
                            <SelectItem value="inactive">{tc("inactive")}</SelectItem>
                            <SelectItem value="paused">{tc("paused")}</SelectItem>
                            <SelectItem value="pending">{tc("pending")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="profile_data.weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("weight")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="75"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile_data.height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("height")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="175"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseFloat(e.target.value) : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="profile_data.birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("birthDate")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile_data.goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("goals")}</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile_data.injuries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("injuries")}</FormLabel>
                        <FormControl>
                          <Textarea rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("notes")}</FormLabel>
                        <FormControl>
                          <Textarea rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/clients">{tc("cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tc("save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
