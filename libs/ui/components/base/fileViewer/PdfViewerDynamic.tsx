/**
 * PdfViewerDynamic — wrapper dùng next/dynamic với ssr: false
 *
 * pdfjs-dist v4+ dùng Promise.withResolvers (ES2024) — không tương thích SSR
 * trên Node < 22. Lazy load client-only để tránh lỗi SSR bundle.
 */
'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type PdfViewerType from './PdfViewer'

const PdfViewerLazy = dynamic(() => import('./PdfViewer'), {
  ssr: false
})

type PdfViewerProps = ComponentProps<typeof PdfViewerType>

const PdfViewer = (props: PdfViewerProps) => <PdfViewerLazy {...props} />

export default PdfViewer
