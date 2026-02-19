import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JoinForm } from "@/components/auth/join-form";
import { useTranslations } from "next-intl";

export default function JoinPage({
  params,
}: {
  params: { token: string };
}) {
  const t = useTranslations("join");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t("title")}</CardTitle>
        <CardDescription className="text-center">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JoinForm token={params.token} />
      </CardContent>
    </Card>
  );
}
