import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        "next-intl/config": "./src/i18n/request.ts",
      },
    },
  },
};

export default withNextIntl(nextConfig);
