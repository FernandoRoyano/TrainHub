"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useClient } from "@/hooks/use-clients";
import { ClientForm } from "@/components/clients/client-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const tc = useTranslations("common");
  const { data: client, isLoading } = useClient(clientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!client) {
    return <p className="text-muted-foreground">{tc("notFound")}</p>;
  }

  return <ClientForm mode="edit" client={client} />;
}
