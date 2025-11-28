/** @type {import('next').NextConfig} */
const path = require('path')
// --- EXTERNAL WRAPPERS ---
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const removeImports = require('next-remove-imports')({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: '\\.(less|css|scss|sass|styl)$',
})

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
]

let nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  optimizeFonts: false,
  swcMinify: false, // BƯỚC 1: transpilePackages vẫn phải giữ để hỗ trợ

  transpilePackages: [
    '@lms/ui',
    '@lms/core',
    '@lms/hooks',
    '@lms/assets',
    '@lms/utils',
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

  webpack: (config, { isServer, defaultLoaders }) => {
    config.resolve.alias.canvas = false
    config.resolve.alias['styled-components'] = require.resolve('styled-components');
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [
        path.resolve(__dirname, '../../features'),
        path.resolve(__dirname, '../../libs'),
      ],
      use: [defaultLoaders.babel],
    })

    return config
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },

  output: 'standalone',

  publicRuntimeConfig: {
    apiURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  },

  images: {
    minimumCacheTTL: 43200,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    unoptimized: true,
  },

  compiler: {
    styledComponents: true,
  },

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
    fetches: { fullUrl: true },
  }, // Tối ưu hóa lại Experimental

  experimental: {
    optimizeCss: true,
    forceSwcTransforms: true,
    instrumentationHook: true,
  },
}

// --- Inject Sentry wrapper ---
const { withSentryConfig } = require('@sentry/nextjs')

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

// --- wrap removeImports + bundle analyzer ---
module.exports = removeImports(withBundleAnalyzer(nextConfig))
