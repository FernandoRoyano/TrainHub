import { Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Train<span className="text-primary">Hub</span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("tagline")}
          </p>
        </div>
        {children}
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/legal" className="hover:text-foreground">
            {t("legalNoticeLink")}
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            {t("privacyLink")}
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            {t("termsLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
