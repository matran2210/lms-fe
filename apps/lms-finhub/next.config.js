/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isProd = process.env.NODE_ENV === 'production'
// =========================
// Base Next.js config
// =========================
const nextConfig = {
  reactStrictMode: isProd,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  output: 'standalone',

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  compiler: {
    styledComponents: true,
    removeConsole: isProd,
  },

  experimental: {
    optimizeCss: isProd,
    instrumentationHook: false,
    optimizePackageImports: ['lodash', 'antd', '@ant-design/icons', 'lucide-react'],
  },
}

// =========================
// Plugins
// =========================
const configWithPlugins = withBundleAnalyzer(nextConfig)

// =========================
// Sentry config
// =========================
module.exports =
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true'
    ? withSentryConfig(configWithPlugins, {
        org: process.env.NEXT_PUBLIC_SENTRY_NAME,
        project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
        silent: !process.env.CI,
        widenClientFileUpload: true,
        tunnelRoute: '/monitoring',
      })
    : configWithPlugins
