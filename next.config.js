/** @type {import('next').NextConfig} */
const path = require('path')
const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const removeImports = require('next-remove-imports')({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: '\\.(less|css|scss|sass|styl)$',
})
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
]

module.exports = removeImports(
  withBundleAnalyzer({
    webpack: (config) => {
      config.resolve.alias.canvas = false

      return config
    },
    i18n,
    reactStrictMode: false,
    productionBrowserSourceMaps: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    optimizeFonts: false,
    output: 'standalone',
    publicRuntimeConfig: {
      apiURL: process.env.REACT_APP_API_PUBLIC,
    },
    images: {
      minimumCacheTTL: 43200,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
      unoptimized: true,
    },
    swcMinify: true,
    async headers() {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
      ]
    },
    poweredByHeader: false,
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    experimental: { optimizeCss: true, forceSwcTransforms: true },
  }),
)

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.NEXT_PUBLIC_SENTRY_NAME,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})
