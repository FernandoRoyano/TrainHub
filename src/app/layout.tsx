import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TrainHub - Plataforma de Entrenamiento Personal",
    template: "%s | TrainHub",
  },
  description:
    "Gestiona tus clientes, crea rutinas personalizadas y comunica con ellos en tiempo real. La plataforma todo-en-uno para entrenadores personales.",
  keywords: [
    "entrenador personal",
    "rutinas",
    "fitness",
    "gym",
    "personal trainer",
    "workout",
    "training platform",
  ],
  authors: [{ name: "TrainHub" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TrainHub",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TrainHub",
    title: "TrainHub - Plataforma de Entrenamiento Personal",
    description:
      "Gestiona tus clientes, crea rutinas y comunica en tiempo real.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1122",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
