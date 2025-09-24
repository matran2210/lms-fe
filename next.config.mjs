import withBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'
import removeImports from 'next-remove-imports'
import path from 'path'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const removeImportsPlugin = removeImports({
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
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
  },
  output: 'standalone',
  images: {
    minimumCacheTTL: 43200,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    unoptimized: true,
  },
  swcMinify: true,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  eslint: { dirs: ['.'] },
  logging: {
    fetches: { fullUrl: true },
  },
  experimental: { optimizeCss: true, forceSwcTransforms: true },
}

nextConfig = bundleAnalyzer(nextConfig)
nextConfig = removeImportsPlugin(nextConfig)

export default withSentryConfig(nextConfig, {
  org: process.env.NEXT_PUBLIC_SENTRY_NAME,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  telemetry: false,
})
