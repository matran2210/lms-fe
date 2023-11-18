/** @type {import('next').NextConfig} */
const path = require('path')
const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  i18n,
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  output: 'standalone',
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    token: process.env.NEXT_PUBLIC_TOKEN,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    hostURL: process.env.NEXT_PUBLIC_HOST_URL,
    GA_TRACK_ID: process.env.NEXT_PUBLIC_GA_TRACK_ID,
    s3URL: process.env.NEXT_PUBLIC_S3_URL,
    apiURL: process.env.REACT_APP_API_PUBLIC,
  },
  images: {
    minimumCacheTTL: 43200,
    domains: ['d3s1adm34w18qs.cloudfront.net'],
  },
  experimental: { optimizeCss: true, forceSwcTransforms: true },
})
