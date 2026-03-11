"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import type { Routine } from "@/services/routines.service";

interface RoutinePdfButtonProps {
  routine: Routine;
  clientName?: string;
  label?: string;
}

export function RoutinePdfButton({ routine, clientName, label = "Descargar PDF" }: RoutinePdfButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { RoutinePdfDocument } = await import("./routine-pdf-document");
      const React = await import("react");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = React.createElement(RoutinePdfDocument, { routine, clientName }) as any;
      const blob = await pdf(doc).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${routine.name.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
