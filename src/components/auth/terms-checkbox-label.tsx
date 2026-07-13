"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Etiqueta del checkbox de consentimiento, compartida entre el registro
// de trainers y el de clientes por invitación
export function TermsCheckboxLabel() {
  const t = useTranslations("auth");

  return (
    <span className="text-xs leading-relaxed text-muted-foreground">
      {t("acceptTermsPrefix")}{" "}
      <Link href="/terms" target="_blank" className="text-primary underline">
        {t("termsLink")}
      </Link>{" "}
      {t("acceptTermsMiddle")}{" "}
      <Link href="/privacy" target="_blank" className="text-primary underline">
        {t("privacyLink")}
      </Link>
      {t("acceptTermsSuffix")}
    </span>
  );
}
