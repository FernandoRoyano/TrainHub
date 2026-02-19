import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function ClientNotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold">{t("notFoundTitle")}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {t("notFoundDescription")}
      </p>
      <Button asChild>
        <Link href="/my-routine">{t("goHome")}</Link>
      </Button>
    </div>
  );
}
