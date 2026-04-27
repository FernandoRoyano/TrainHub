import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HelpContent } from "@/components/help/help-content";

interface Params {
  params: Promise<{ locale: string }>;
}

export default async function HelpPage({ params }: Params) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const role = (user.user_metadata?.role as "trainer" | "client" | "admin") ?? "trainer";

  return <HelpContent locale={locale === "en" ? "en" : "es"} role={role} />;
}
