// app/layout.tsx
import type { ReactNode } from 'react'
import { Providers } from './providers'
import Metadata from '@components/common/Metadata'
// TODO: Next14
import '@lms/styles'
import '@fortune-sheet/react/dist/index.css'
import '@sapp-fe/entrance-test-result-package/dist/index.css'
import '@sapp-fe/preview-part/dist/index.css'
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

export const metadata = {
  title: 'LMS Pro',
  description: 'LMS Pro App',
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="vi">
      <Metadata />
      <body>
        <Providers>
          <ClientLayout />
          {children}
          {/* </ClientLayout> */}
          </Providers>
      </body>
    </html>
  )
}
