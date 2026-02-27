// app/layout.tsx
import type { ReactNode } from 'react'
import { Providers } from './providers'
import '@lms/styles'
import '@fortune-sheet/react/dist/index.css'
import '@sapp-fe/quiz-result-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/sapp-editor.css'
import '@sapp-fe/sapp-notification/dist/index.css'
import '@styles/index.scss'
import '@xyflow/react/dist/style.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import 'aos/dist/aos.css'
import ClientLayout from './client-layout'
import Script from 'next/script'
import { Roboto } from 'next/font/google'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  metadataBase: new URL('https://lms-pro.sapp.edu.vn'),

  title: {
    default:
      'Hệ thống Quản lý học và thi ACCA, CFA, CMA trực tuyến SAPP Academy',
    template: '%s | SAPP Academy',
  },

  description:
    'Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA, CMA',

  keywords: [
    'sapp',
    'lms',
    'acca',
    'ACCA',
    'CFA',
    'CMA',
    'Big4',
    '3P',
    'SAPP Academy',
  ],

  authors: [{ name: 'SAPP Academy' }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    url: 'https://lms-pro.sapp.edu.vn',
    title: 'Hệ thống Quản lý học và thi ACCA, CFA, CMA trực tuyến SAPP Academy',
    description:
      'Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA, CMA',
    images: [
      {
        url: 'https://sapp-lms-fe-prod.vercel.app/thumbnail.webp',
        width: 1200,
        height: 630,
        alt: 'SAPP LMS Thumbnail',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Hệ thống Quản lý học và thi ACCA, CFA, CMA trực tuyến SAPP Academy',
    description:
      'Hệ thống Nền tảng Học và Thi trực tuyến được SAPP Academy xây dựng nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập ACCA, CFA, CMA',
    images: ['https://sapp-lms-fe-prod.vercel.app/thumbnail.webp'],
  },

  viewport: {
    width: 'device-width',
    initialScale: 1,
  },

  other: {
    'X-UA-Compatible': 'IE=edge,chrome=1',
    analytics: 'G-HRLKW6S3X0',
    'csrf-token': 'Hl4U5KjkBFkHN2m2ptOE1L8QbTGV19yrEINaOrsd',
  },
}

export const revalidate = 0

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <Script
          src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
          strategy="beforeInteractive"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ''}
        />
      </head>
      <body className={roboto.className}>
        <Providers>
          <ClientLayout />
          {children}
          {/* </ClientLayout> */}
        </Providers>
      </body>
    </html>
  )
}
