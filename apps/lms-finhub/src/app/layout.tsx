// app/layout.tsx
'use client'
import type { ReactNode } from 'react'
import Metadata from '@components/common/Metadata'
import { ErrorBoundary } from '@sentry/nextjs'
import ErrorRedirectPage from './error-redirect/page'
import { Providers } from './provider'
import '@lms/styles'
import '@sapp-fe/entrance-test-result-package/dist/index.css'
import '@sapp-fe/preview-part/dist/index.css'
import '@sapp-fe/quiz-result-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/sapp-editor.css'
import '@sapp-fe/sapp-notification/dist/index.css'

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
