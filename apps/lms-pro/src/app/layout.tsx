// app/layout.tsx
import type { ReactNode } from 'react'
import { Providers } from './providers'
import Metadata from '@components/common/Metadata'

export const metadata = {
  title: 'LMS Pro',
  description: 'LMS Pro App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <Metadata />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
