"use client";

import { useSearchParams } from "next/navigation";
import { RoutineBuilder } from "@/components/routines/routine-builder";

export default function NewRoutinePage() {
  const searchParams = useSearchParams();
  const isTemplate = searchParams.get("template") === "true";

  return <RoutineBuilder mode="create" defaultTemplate={isTemplate} />;
}
