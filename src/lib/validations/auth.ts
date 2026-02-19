import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string, values?: any) => string;

export function createLoginSchema(t: T) {
  return z.object({
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(6, t("minChars", { min: 6 })),
  });
}

export function createRegisterSchema(t: T) {
  return z
    .object({
      fullName: z.string().min(2, t("minChars", { min: 2 })),
      email: z.string().email(t("invalidEmail")),
      password: z.string().min(6, t("minChars", { min: 6 })),
      confirmPassword: z.string().min(6, t("minChars", { min: 6 })),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
}

export function createForgotPasswordSchema(t: T) {
  return z.object({
    email: z.string().email(t("invalidEmail")),
  });
}

export function createUpdateProfileSchema(t: T) {
  return z.object({
    full_name: z.string().min(2, t("minChars", { min: 2 })),
    username: z
      .string()
      .min(3, t("minChars", { min: 3 }))
      .max(30, t("maxChars", { max: 30 }))
      .regex(/^[a-zA-Z0-9_]+$/, t("onlyAlphanumeric"))
      .optional()
      .or(z.literal("")),
    bio: z.string().max(500, t("maxChars", { max: 500 })).optional().or(z.literal("")),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type UpdateProfileFormData = z.infer<ReturnType<typeof createUpdateProfileSchema>>;
