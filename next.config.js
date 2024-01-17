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
      domains: [
        'd3s1adm34w18qs.cloudfront.net',
        'cdn-dev.sapp.edu.vn',
        'media.zim.vn',
        'cdn-staging.sapp.edu.vn',
      ],
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
