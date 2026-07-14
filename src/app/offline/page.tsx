"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <html lang="es">
      <body className="bg-[#09090b] text-white">
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="rounded-full bg-white/10 p-6 mb-6">
            <WifiOff className="h-12 w-12 text-white/60" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Sin conexion</h1>
          <p className="text-white/60 max-w-sm mb-8">
            No tienes conexion a internet. Revisa tu conexion e intentalo de
            nuevo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
