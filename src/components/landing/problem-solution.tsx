"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("problemSolutionTitle")}
            <br />
            <span className="text-muted-foreground">
              {t("problemSolutionTitleHighlight")}
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-sm font-medium text-rose-400 uppercase tracking-wider mb-6">
              {t("problemLabel")}
            </p>
            {problems.map((problem, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10"
              >
                <X className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm">{problem}</p>
              </div>
            ))}
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-6">
              {t("solutionLabel")}
            </p>
            {solutions.map((solution, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{solution}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
