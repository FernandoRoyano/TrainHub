import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrainHub - Entrenamiento Personal",
    short_name: "TrainHub",
    description: "Gestiona clientes, crea rutinas y comunica en tiempo real",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["fitness", "health", "sports"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Clientes",
        short_name: "Clientes",
        url: "/clients",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Mensajes",
        short_name: "Mensajes",
        url: "/messages",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
