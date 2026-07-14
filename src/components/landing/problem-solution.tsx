"use client";

import { useTranslations } from "next-intl";
import { X, Check } from "lucide-react";

const PROBLEM_COUNT = 4;
const SOLUTION_COUNT = 4;

export function ProblemSolution() {
  const t = useTranslations("landing");

  const problems = Array.from({ length: PROBLEM_COUNT }, (_, i) =>
    t(`problem${i + 1}`)
  );
  const solutions = Array.from({ length: SOLUTION_COUNT }, (_, i) =>
    t(`solution${i + 1}`)
  );

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-fluid-4xl font-bold leading-tight">
            {t("problemSolutionTitle")}
            <br />
            <span className="text-muted-foreground">
              {t("problemSolutionTitleHighlight")}
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Problems */}
          <div className="space-y-4 reveal-on-scroll">
            <p className="text-sm font-medium text-destructive uppercase tracking-wider mb-6">
              {t("problemLabel")}
            </p>
            {problems.map((problem, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
              >
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-fluid-sm">{problem}</p>
              </div>
            ))}
          </div>

          {/* Solutions */}
          <div className="space-y-4 reveal-on-scroll">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-6">
              {t("solutionLabel")}
            </p>
            {solutions.map((solution, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-fluid-sm">{solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
