// app/layout.tsx
import type { ReactNode } from 'react'
import { ProvidersWrapper } from './providers'
// TODO: Next14
import '@fortune-sheet/react/dist/index.css'
import '@lms/styles'
import '@sapp-fe/entrance-test-result-package/dist/index.css'
import '@sapp-fe/preview-part/dist/index.css'
import '@sapp-fe/quiz-result-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/sapp-editor.css'
import '@sapp-fe/sapp-notification/dist/index.css'
import '@styles/index.scss'
import '@xyflow/react/dist/style.css'
import 'aos/dist/aos.css'
import Script from 'next/script'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import ClientLayout from './client-layout'
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
        url: 'https://sapp-lms-fe-prod.vercel.app/thumbnail.png',
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
    images: ['https://sapp-lms-fe-prod.vercel.app/thumbnail.png'],
  },

  other: {
    'X-UA-Compatible': 'IE=edge,chrome=1',
    analytics: 'G-HRLKW6S3X0',
    'csrf-token': 'Hl4U5KjkBFkHN2m2ptOE1L8QbTGV19yrEINaOrsd',
  },
}
export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
          strategy="afterInteractive"
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
        <ProvidersWrapper>
          <ClientLayout />
          {children}
          {/* </ClientLayout> */}
        </ProvidersWrapper>
      </body>
    </html>
  )
}
