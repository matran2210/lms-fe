import { AppProvider } from '@/components/AppProvider'
import { Header } from '@/components/layout/Header'
import SAPPLoading from '@/components/loading/SAPPLoading'
import '@/styles/global.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Zoom Meeting',
  description: 'Zoom Meeting',
  icons: [
    {
      rel: 'favicon-touch-icon',
      url: '/favicon-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="zoom-app">
          <Suspense fallback={<SAPPLoading />}>
            <AppProvider>
              <Header />
              {children}
              <Toaster />
            </AppProvider>
          </Suspense>
        </div>
      </body>
    </html>
  )
}
