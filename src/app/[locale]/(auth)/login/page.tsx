import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t("login")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <div className="text-center text-sm space-y-2">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-primary underline"
          >
            {t("forgotPassword")}
          </Link>
          <p>
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary underline">
              {t("register")}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
