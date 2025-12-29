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
    '@lms/styles',
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

  poweredByHeader: false,

  experimental: {
    optimizeCss: true,
    instrumentationHook: true,
  },
})
