// app/layout.tsx
import type { ReactNode } from 'react'
import Metadata from '@components/common/Metadata'
import '@lms/styles'
import '@fortune-sheet/react/dist/index.css'
import '@sapp-fe/entrance-test-result-package/dist/index.css'
import '@sapp-fe/preview-part/dist/index.css'
import '@sapp-fe/quiz-result-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/index.css'
import '@sapp-fe/sapp-common-package/dist/sapp-editor.css'
import '@sapp-fe/sapp-notification/dist/index.css'
import '@xyflow/react/dist/style.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import 'aos/dist/aos.css'
import { ProvidersWrapper } from './provider'
import Script from 'next/script'

export const revalidate = 0

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="vi">
        <body>
          <Script
            src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
            strategy="afterInteractive"
          />
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </body>
      </html>
  )
}
