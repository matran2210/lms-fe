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
export const metadata = {
  title: 'LMS Pro',
  description: 'LMS Pro App',
}
export const revalidate = 0
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Script
          src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
          strategy="afterInteractive"
        />
        <ProvidersWrapper>
          <ClientLayout />
          {children}
          {/* </ClientLayout> */}
        </ProvidersWrapper>
      </body>
    </html>
  )
}
