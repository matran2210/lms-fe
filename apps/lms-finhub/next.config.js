/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,

  productionBrowserSourceMaps: true,

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

  output: 'standalone',

  images: {
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
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },

  poweredByHeader: false,

  experimental: {
    optimizeCss: true,
    instrumentationHook: true,
  },
})
