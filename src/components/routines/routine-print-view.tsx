"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Routine } from "@/services/routines.service";

interface RoutinePrintViewProps {
  routine: Routine;
}

export function RoutinePrintView({ routine }: RoutinePrintViewProps) {
  const t = useTranslations("routines");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${routine.name} - TrainHub</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          h2 { font-size: 16px; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #111; }
          .meta { color: #666; font-size: 13px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { text-align: left; padding: 6px 8px; font-size: 13px; border-bottom: 1px solid #ddd; }
          th { font-weight: 600; background: #f5f5f5; }
          .superset { background: #f0f9ff; }
          .footer { margin-top: 24px; text-align: center; color: #999; font-size: 11px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <div class="footer">TrainHub - ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        {t("exportPdf")}
      </Button>

      {/* Hidden printable content */}
      <div ref={printRef} className="hidden">
        <h1>{routine.name}</h1>
        {routine.description && (
          <p className="meta">{routine.description}</p>
        )}
        <p className="meta">
          {routine.duration_weeks} {t("durationWeeks").toLowerCase()} &bull;{" "}
          {routine.days_per_week} {t("daysPerWeek").toLowerCase()} &bull;{" "}
          {routine.difficulty}
        </p>

        {(routine.days ?? []).map((day) => (
          <div key={day.id}>
            <h2>
              {t("day", { number: day.day_number })}
              {day.name ? ` - ${day.name}` : ""}
            </h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("addExercise").replace("Añadir ", "").replace("Add ", "")}</th>
                  <th>{t("sets")}</th>
                  <th>{t("reps")}</th>
                  <th>{t("rest")}</th>
                  <th>{t("notes")}</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => (
                  <tr
                    key={ex.id}
                    className={ex.superset_group !== null ? "superset" : ""}
                  >
                    <td>{i + 1}</td>
                    <td>
                      {ex.exercise?.name ?? "Exercise"}
                      {ex.superset_group !== null && " (SS)"}
                    </td>
                    <td>{ex.sets}</td>
                    <td>{ex.reps}</td>
                    <td>{ex.rest_seconds}s</td>
                    <td>{ex.notes ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
