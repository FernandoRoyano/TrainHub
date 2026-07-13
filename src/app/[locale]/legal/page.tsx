import { LegalContent } from "@/components/legal/legal-content";

interface Params {
  params: Promise<{ locale: string }>;
}

// Página pública: aviso legal (LSSI)
export default async function LegalNoticePage({ params }: Params) {
  const { locale } = await params;
  return <LegalContent doc="legal" locale={locale === "en" ? "en" : "es"} />;
}
