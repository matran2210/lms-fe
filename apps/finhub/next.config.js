/** @type {import('next').NextConfig} */
const path = require('path')

// ✅ 1. BẮT BUỘC DÙNG CÁI NÀY CHO NEXT 12
const withTM = require('next-transpile-modules')([
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
  // 'sapp-common-package', // Bỏ comment nếu vẫn lỗi css package này
])

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
]

let nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false, // ✅ Tắt map để không crash
  optimizeFonts: false,
  swcMinify: true, // ✅ Nên bật true để nhanh
  staticPageGenerationTimeout: 1000,

  // ❌ ĐÃ XÓA: transpilePackages (Vô dụng ở Next 12)

  webpack: (config, { isServer, defaultLoaders }) => {
    config.resolve.alias.canvas = false

    // ✅ Fix lỗi duplicate styled-components (Mất style)
    try {
      config.resolve.alias['styled-components'] =
        require.resolve('styled-components')
    } catch (e) {}

    // ✅ Fix lỗi crash do source map hỏng
    config.ignoreWarnings = [/Failed to parse source map/, /Invalid mapping/]

    // ❌ ĐÃ XÓA: config.module.rules thủ công (withTM đã lo việc này rồi)

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
    domains: ['**'],
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

  // ❌ ĐÃ XÓA: logging (Next 12 không có)

  experimental: {
    optimizeCss: false, // ⛔ BẮT BUỘC FALSE ĐỂ KHÔNG TREO MÁY
    forceSwcTransforms: true,
    instrumentationHook: false, // Tắt đi cho nhẹ
    esmExternals: 'loose',
  },
}

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

// ✅ BỌC withTM RA NGOÀI CÙNG (Quan trọng nhất)
module.exports = withBundleAnalyzer(withTM(nextConfig))
