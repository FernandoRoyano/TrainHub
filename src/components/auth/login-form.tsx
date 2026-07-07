"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createLoginSchema, type LoginFormData } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, MailWarning, AlertTriangle } from "lucide-react";

interface LoginFormProps {
  // Código de error que el callback de auth pasa por query string
  // (otp_expired, access_denied...) para mostrarlo aquí en vez de perderse.
  urlError?: string;
}

export function LoginForm({ urlError }: LoginFormProps) {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(tv)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const { user } = await authService.signIn(data.email, data.password);
      const role = user?.user_metadata?.role;
      router.push(role === "client" ? "/my-routine" : "/dashboard");
      router.refresh();
    } catch (error) {
      const code = (error as { code?: string })?.code;
      const message = error instanceof Error ? error.message : "";
      if (
        code === "email_not_confirmed" ||
        message.toLowerCase().includes("email not confirmed")
      ) {
        setUnconfirmedEmail(data.email);
      } else {
        setUnconfirmedEmail(null);
        toast.error(t("loginError"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!unconfirmedEmail) return;
    setResending(true);
    try {
      await authService.resendConfirmation(unconfirmedEmail);
      toast.success(t("confirmationResent"));
      setUnconfirmedEmail(null);
    } catch {
      toast.error(t("resendError"));
    } finally {
      setResending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {urlError && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              {urlError === "otp_expired"
                ? t("invalidOrExpiredLink")
                : t("callbackError")}
            </span>
          </div>
        )}

        {unconfirmedEmail && (
          <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
            <div className="flex items-start gap-2">
              <MailWarning className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                {t("emailNotConfirmed")}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleResend}
              disabled={resending}
            >
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("resendConfirmation")}
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="******"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("login")}
        </Button>
      </form>
    </Form>
  );
}
