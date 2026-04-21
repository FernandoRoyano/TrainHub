"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_COUNT = 6;

export function FAQ() {
  const t = useTranslations("landing");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`faq${i + 1}Question`),
    answer: t(`faq${i + 1}Answer`),
  }));

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal-on-scroll">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="text-fluid-4xl font-bold mb-4">
            {t("faqTitle")}
          </h2>
          <p className="text-muted-foreground text-fluid-base">
            {t("faqSubtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card/50 overflow-hidden hover:border-primary/30 transition-colors reveal-on-scroll"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left"
              >
                <span className="text-fluid-sm font-medium pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-4 text-fluid-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
