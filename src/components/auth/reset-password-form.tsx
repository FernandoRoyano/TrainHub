"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { createPasswordSchema } from "@/lib/validations/auth";
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
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createResetSchema(t: (key: string, values?: any) => string) {
  return z
    .object({
      password: createPasswordSchema(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
}

type ResetFormData = z.infer<ReturnType<typeof createResetSchema>>;

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(createResetSchema(tv)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function verifyToken() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type === "recovery") {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (!error) {
          setVerified(true);
        }
      } else {
        // No token in URL — check if user already has an active recovery session
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setVerified(true);
        }
      }
      setIsVerifying(false);
    }
    verifyToken();
  }, [searchParams]);

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

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="text-center space-y-4 py-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <p className="text-sm text-muted-foreground">{t("invalidOrExpiredLink")}</p>
        <Button asChild variant="outline">
          <Link href="/forgot-password">{t("requestNewLink")}</Link>
        </Button>
      </div>
    );
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
