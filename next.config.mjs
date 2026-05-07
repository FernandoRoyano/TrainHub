import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: { document: "/offline" },
  // extendDefaultRuntimeCaching es opción del plugin next-pwa, no de workbox.
  // Estaba dentro de workboxOptions y rompía el build (warning silenciado por cache).
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      // Las rutas de auth nunca deben pasar por cache del SW. Si el SW responde
      // un 404 cacheado al callback, la confirmación de email queda en blanco.
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/auth/"),
        handler: "NetworkOnly",
      },
      {
        urlPattern: ({ url }) => url.hostname.endsWith(".supabase.co"),
        handler: "NetworkOnly",
        method: "GET",
      },
      {
        urlPattern: ({ url }) => url.hostname.endsWith(".supabase.co"),
        handler: "NetworkOnly",
        method: "POST",
      },
      {
        urlPattern: ({ url }) => url.hostname.endsWith(".supabase.co"),
        handler: "NetworkOnly",
        method: "PATCH",
      },
      {
        urlPattern: ({ url }) => url.hostname.endsWith(".supabase.co"),
        handler: "NetworkOnly",
        method: "DELETE",
      },
    ],
  },
});

// CSP permite 'unsafe-inline' en scripts/styles porque Next.js inyecta inline
// scripts y Tailwind/next-intl emiten styles inline. Endurecer con nonces es
// un cambio mayor; este baseline ya bloquea XSS de orígenes externos.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.nal.usda.gov https://challenges.cloudflare.com",
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
