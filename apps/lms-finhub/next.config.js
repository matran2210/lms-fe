/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isDevelopment = process.env.NODE_ENV === 'development'

// =========================
// Base Next.js config
// =========================
const nextConfig = {
  reactStrictMode: !isDevelopment,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  output: 'standalone',

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: !isDevelopment,
    instrumentationHook: false,
  },
}

// =========================
// Wrap plugins
// =========================
const configWithPlugins = withBundleAnalyzer(nextConfig)

// =========================
// Sentry config
// =========================
module.exports = withSentryConfig(configWithPlugins, {
  org: process.env.NEXT_PUBLIC_SENTRY_NAME,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
})
