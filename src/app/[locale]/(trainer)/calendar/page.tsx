"use client";

import { useTranslations } from "next-intl";
import { SessionsCalendar } from "@/components/calendar/sessions-calendar";

export default function CalendarPage() {
  const t = useTranslations("calendar");

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
      <SessionsCalendar />
    </div>
  );
}
