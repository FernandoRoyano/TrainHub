import { LegalContent } from "@/components/legal/legal-content";

interface Params {
  params: Promise<{ locale: string }>;
}

// Página pública: debe poder leerse ANTES de registrarse
export default async function PrivacyPage({ params }: Params) {
  const { locale } = await params;
  return <LegalContent doc="privacy" locale={locale === "en" ? "en" : "es"} />;
}
