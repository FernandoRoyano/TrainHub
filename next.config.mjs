import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: { document: "/offline" },
  workboxOptions: {
    extendDefaultRuntimeCaching: true,
    runtimeCaching: [
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

const securityHeaders = [
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
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
