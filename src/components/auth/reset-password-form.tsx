"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle } from "lucide-react";

function createResetSchema(t: (key: string) => string) {
  return z
    .object({
      password: z.string().min(6, t("passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMustMatch"),
      path: ["confirmPassword"],
    });
}

type ResetFormData = z.infer<ReturnType<typeof createResetSchema>>;

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(createResetSchema(tv)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetFormData) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) throw error;
      setSuccess(true);
      toast.success(t("passwordUpdated"));
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error(t("resetError"));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-2 py-4">
        <CheckCircle className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-lg font-semibold">{t("passwordUpdated")}</h3>
        <p className="text-sm text-muted-foreground">{t("redirectingLogin")}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("updatePassword")}
        </Button>
      </form>
    </Form>
  );
}
