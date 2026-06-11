"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Share2 } from "lucide-react";
import type { Routine } from "@/services/routines.service";

interface RoutinePdfButtonProps {
  routine: Routine;
  clientName?: string;
  label?: string;
}

// Nombre ASCII seguro: WhatsApp (sobre todo Web/escritorio) rechaza o corrompe
// adjuntos cuyo nombre lleva acentos, comas u otros signos
function safeFileName(name: string): string {
  const ascii = name.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const clean = ascii.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${clean || "rutina"}.pdf`;
}

export function RoutinePdfButton({ routine, clientName, label }: RoutinePdfButtonProps) {
  const t = useTranslations("routines");
  const [loading, setLoading] = useState<"download" | "share" | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Web Share API con archivos (móvil): permite enviar el PDF directamente
    // a WhatsApp sin pasar por descargar + adjuntar manualmente
    const probe = new File(["x"], "x.pdf", { type: "application/pdf" });
    setCanShare(
      typeof navigator !== "undefined" && !!navigator.canShare?.({ files: [probe] })
    );
  }, []);

  const buildPdf = async () => {
    const { pdf } = await import("@react-pdf/renderer");
    const { RoutinePdfDocument } = await import("./routine-pdf-document");
    const React = await import("react");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = React.createElement(RoutinePdfDocument, { routine, clientName }) as any;
    return pdf(doc).toBlob();
  };

  const handleDownload = async () => {
    setLoading("download");
    try {
      const blob = await buildPdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeFileName(routine.name);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revocar en diferido: hacerlo justo tras click() aborta la descarga en
      // iOS/Safari y deja un PDF corrupto que luego falla al compartirlo
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error(t("pdfError"));
    } finally {
      setLoading(null);
    }
  };

  const handleShare = async () => {
    setLoading("share");
    try {
      const blob = await buildPdf();
      const file = new File([blob], safeFileName(routine.name), {
        type: "application/pdf",
      });
      await navigator.share({ files: [file], title: routine.name });
    } catch (err) {
      // Cerrar la hoja de compartir no es un error
      if ((err as DOMException)?.name !== "AbortError") {
        toast.error(t("pdfError"));
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownload} disabled={loading !== null}>
        {loading === "download" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="mr-2 h-4 w-4" />
        )}
        {label ?? t("downloadPdf")}
      </Button>
      {canShare && (
        <Button variant="outline" onClick={handleShare} disabled={loading !== null}>
          {loading === "share" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          {t("sharePdf")}
        </Button>
      )}
    </div>
  );
}
