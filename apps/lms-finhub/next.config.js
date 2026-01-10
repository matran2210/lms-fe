/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false, // loại bỏ X-Powered-By

  output: 'standalone',

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  compiler: {
    styledComponents: true,
  },

  experimental: {
    optimizeCss: true,
    instrumentationHook: false,
    removeConsole: true,
  },
})
