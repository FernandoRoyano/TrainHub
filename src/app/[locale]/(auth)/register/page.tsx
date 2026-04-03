import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  const t = useTranslations("auth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t("register")}</CardTitle>
        <p className="text-center text-xs text-muted-foreground mt-1">{t("trainerRegistration")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <div className="text-center text-sm">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-primary underline">
            {t("login")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
