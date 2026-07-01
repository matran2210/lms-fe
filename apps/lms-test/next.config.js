/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";
// =========================
// Base Next.js config
// =========================
const nextConfig = {
  reactStrictMode: isProd,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  output: "standalone",

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  compiler: {
    styledComponents: true,
    removeConsole: isProd,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        // require-in-the-middle dùng dynamic require — không ảnh hưởng runtime
        { module: /require-in-the-middle/ },
        { module: /@opentelemetry\/instrumentation/ },
        { module: /@fastify\/otel/ },
      ];
    }

    config.module.rules.push({
      test: /\.(webm)$/i,
      type: "asset/resource",
    });

    return config;
  },
  experimental: {
    optimizeCss: isProd,
    instrumentationHook: false,
  },
};

// =========================
// Plugins
// =========================
const configWithPlugins = withBundleAnalyzer(nextConfig);

// =========================
// Sentry config
// =========================
module.exports =
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true"
    ? withSentryConfig(configWithPlugins, {
        org: process.env.NEXT_PUBLIC_SENTRY_NAME,
        project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
        silent: !process.env.CI,
        widenClientFileUpload: true,
        tunnelRoute: "/monitoring",
      })
    : configWithPlugins;
