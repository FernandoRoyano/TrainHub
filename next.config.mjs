import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // clientsClaim: el SW nuevo toma control de las pestañas abiertas sin esperar
  // a cierre/reload. Sin esto los usuarios ven la versión vieja tras un deploy
  // y tienen que borrar caché manualmente (causa raíz reportada).
  reloadOnOnline: true,
  cacheOnFrontEndNav: false,
  workboxOptions: {
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      // Auth: nunca cachear, evita el bug del 404 del callback.
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/auth/"),
        handler: "NetworkOnly",
      },
      // API y Supabase REST: siempre red (datos vivos).
      {
        urlPattern: ({ url }) =>
          url.pathname.startsWith("/api/") ||
          url.hostname.endsWith(".supabase.co"),
        handler: "NetworkOnly",
      },
      // Imágenes de Supabase Storage: NetworkFirst con fallback a caché y
      // ttl corto. Evita servir imágenes rotas indefinidamente y mantiene
      // velocidad cuando hay red.
      {
        urlPattern: ({ request, url }) =>
          request.destination === "image" &&
          url.hostname.endsWith(".supabase.co"),
        handler: "NetworkFirst",
        options: {
          cacheName: "supabase-images",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Imágenes externas de la librería de ejercicios.
      {
        urlPattern: ({ request, url }) =>
          request.destination === "image" &&
          url.hostname === "raw.githubusercontent.com",
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "exercise-db-images",
          expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});

// CSP permite 'unsafe-inline' en scripts/styles porque Next.js inyecta inline
// scripts y Tailwind/next-intl emiten styles inline. Endurecer con nonces es
// un cambio mayor; este baseline ya bloquea XSS de orígenes externos.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.nal.usda.gov https://challenges.cloudflare.com https://raw.githubusercontent.com https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://js.stripe.com https://challenges.cloudflare.com https://hooks.stripe.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=(self), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy",   value: csp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // next/image rechaza URLs externas si no están declaradas aquí. Sin esto
  // muchas imágenes de ejercicios y de Supabase Storage no cargaban.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    minimumCacheTTL: 60 * 60 * 24,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  experimental: {
    turbo: {
      resolveAlias: { "next-intl/config": "./src/i18n/request.ts" },
    },
  },
};

export default withPWA(withNextIntl(nextConfig));
