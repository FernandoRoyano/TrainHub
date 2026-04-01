"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createRegisterSchema, type RegisterFormData } from "@/lib/validations/auth";
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
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface JoinFormProps {
  token: string;
}

export function JoinForm({ token }: JoinFormProps) {
  const t = useTranslations("join");
  const ta = useTranslations("auth");
  const tv = useTranslations("validation");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema(tv)),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch(`/api/verify-invite?token=${token}`);
        const data = await res.json();
        if (data.valid) {
          setIsValid(true);
          if (data.clientName) form.setValue("fullName", data.clientName);
          if (data.clientEmail) form.setValue("email", data.clientEmail);
          setHasProfile(data.hasProfile || false);
        }
      } catch {
        // Token invalid
      } finally {
        setIsVerifying(false);
      }
    }
    verifyToken();
  }, [token, form]);

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      await authService.signUpAsClient(
        data.email,
        data.password,
        data.fullName,
        token
      );
      setSuccess(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : ta("registerError");
      toast.error(message);
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

  if (!isValid) {
    return (
      <div className="text-center space-y-4 py-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <p className="text-sm text-muted-foreground">{t("invalidToken")}</p>
        <Button asChild variant="outline">
          <Link href="/login">{t("goToLogin")}</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <h3 className="text-lg font-semibold">{t("accountCreated")}</h3>
        <p className="text-sm text-muted-foreground">{t("accountCreatedDesc")}</p>
        <Button asChild>
          <Link href="/login">{ta("login")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ta("fullName")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={ta("namePlaceholder")}
                  autoComplete="name"
                  disabled={hasProfile && !!field.value}
                  className={hasProfile && field.value ? "bg-muted" : ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ta("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={ta("emailPlaceholder")}
                  autoComplete="email"
                  disabled={hasProfile && !!field.value}
                  className={hasProfile && field.value ? "bg-muted" : ""}
                  {...field}
                />
              </FormControl>
              {hasProfile && field.value && (
                <p className="text-[10px] text-muted-foreground">{t("prefilledByTrainer")}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ta("password")}</FormLabel>
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
              <FormLabel>{ta("confirmPassword")}</FormLabel>
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
          {ta("register")}
        </Button>
      </form>
    </Form>
  );
}
