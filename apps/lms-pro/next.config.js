/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isDevelopment = process.env.NODE_ENV === 'development'

// =========================
// Base Next.js config
// =========================
let nextConfig = {
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
// Bundle analyzer
// =========================
nextConfig = withBundleAnalyzer(nextConfig)


nextConfig = isDevelopment ? nextConfig : withSentryConfig(
  nextConfig,
  {
    telemetry: false,
    org: process.env.NEXT_PUBLIC_SENTRY_NAME,
    project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: false,
    hideSourceMaps: true,
    disableLogger: true,
    tunnelRoute: '/monitoring',
    automaticVercelMonitors: false,
  },
  {
    transpileClientSDK: false,
    hideSourcemaps: true,
  },
)

module.exports = nextConfig
