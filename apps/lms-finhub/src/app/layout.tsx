// app/layout.tsx
'use client'
import type { ReactNode } from 'react'
import Metadata from '@components/common/Metadata'
import { ErrorBoundary } from '@sentry/nextjs'
import ErrorRedirectPage from './error-redirect/page'
import { Providers } from './provider'

// export const metadata = {
//     title: 'LMS Pro',
//     description: 'LMS Pro App',
// }

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary fallback={<ErrorRedirectPage />}>
        <html lang="vi">
            <Metadata />
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html></ErrorBoundary>
    )
}
