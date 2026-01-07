/** @type {import('next').NextConfig} */
const path = require('path')

// --- EXTERNAL WRAPPERS ---
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,

  // output: 'standalone',
  images: {
    minimumCacheTTL: 43200,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },

  experimental: {
    appDir: true,
    externalDir: true,
    transpilePackages: [
      '@lms/ui',
      '@lms/core',
      '@lms/hooks',
      '@lms/assets',
      '@lms/utils',
      '@lms/styles',
      '@lms/contexts',
      '@lms/feature-user',
      '@lms/feature-class',
      '@lms/feature-auth',
      '@lms/feature-dashboard',
      '@lms/feature-courses',
      '@lms/feature-notifications',
      '@lms/feature-test',
      '@lms/feature-calendar',
    ],
  },
}

// --- Inject Sentry wrapper ---
const { withSentryConfig } = require('@sentry/nextjs')
const isSentryDisabled = true

if (!isSentryDisabled) {
  nextConfig = withSentryConfig(nextConfig, {
    org: process.env.NEXT_PUBLIC_SENTRY_NAME,
    project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  })
}

// --- wrap removeImports + bundle analyzer ---
module.exports = withBundleAnalyzer(nextConfig)
