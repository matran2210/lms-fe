/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

// Polyfill Promise.withResolvers cho môi trường SSR (Node < 22 / pdfjs-dist v4+)
// Chạy trước khi webpack bundle được load
if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }
}

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
    // Chỉ bật styledComponents ở prod — ở dev không cần, tránh overhead compile
    styledComponents: isProd,
    removeConsole: isProd,
  },

  // Suppress known harmless webpack warnings từ Sentry/OpenTelemetry internals
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        // require-in-the-middle dùng dynamic require — không ảnh hưởng runtime
        { module: /require-in-the-middle/ },
        { module: /@opentelemetry\/instrumentation/ },
        { module: /@fastify\/otel/ },
      ]
    }
    return config
  },

  experimental: {
    optimizeCss: isProd,
    instrumentationHook: false,
    optimizePackageImports: ['lodash', 'antd', '@ant-design/icons', 'lucide-react'],
    // Tăng tốc webpack build bằng worker thread riêng
    webpackBuildWorker: true,
    // Tree-shake barrel imports — giảm số module webpack phải parse mỗi route
    // Bao gồm tất cả workspace packages + heavy third-party libs
    optimizePackageImports: [
      // Third-party heavy libs
      'antd',
      '@ant-design/icons',
      'lodash',
      'date-fns',
      'dayjs',
      'echarts',
      'recharts',
      'framer-motion',
      '@xyflow/react',
      'lucide-react',
      // Workspace libs
      '@lms/ui',
      '@lms/utils',
      '@lms/core',
      '@lms/hooks',
      '@lms/contexts',
      '@lms/assets',
      '@lms/hoc',
      // Workspace features — mỗi cái là 1 barrel lớn
      '@lms/feature-auth',
      '@lms/feature-courses',
      '@lms/feature-schedule',
      '@lms/feature-class',
      '@lms/feature-test',
      '@lms/feature-user',
      '@lms/feature-dashboard',
      '@lms/feature-notifications',
      '@lms/feature-certificate',
      '@lms/feature-examination',
    ],
  },
}

// =========================
// Plugins
// =========================
const configWithPlugins = withBundleAnalyzer(nextConfig)

// =========================
// Sentry config — chỉ wrap ở prod hoặc khi NEXT_PUBLIC_ENABLE_SENTRY=true
// Ở dev local không cần Sentry → bỏ overhead source map upload
// =========================
module.exports = process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true'
  ? withSentryConfig(
      configWithPlugins,
      {
        org: process.env.NEXT_PUBLIC_SENTRY_NAME,
        project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
        silent: !process.env.CI,
        widenClientFileUpload: true,
        tunnelRoute: '/monitoring',
        // Tắt source map upload ở dev để không chậm
        sourcemaps: {
          disable: isDev,
        },
      }
    )
  : configWithPlugins
