/**
 * SheetViewerDynamic — lazy wrapper cho SheetViewer
 *
 * @fortune-sheet/react + exceljs rất nặng (~500KB+).
 * Chỉ load khi user thực sự mở file SHEET.
 */
'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type SheetViewerType from './SheetViewer'
import { LoadingIcon } from '@lms/assets'

const SheetViewerLazy = dynamic(() => import('./SheetViewer'), {
  ssr: false,
  // loading: () => (
  //   <div className="flex h-full w-full items-center justify-center">
  //     <LoadingIcon stroke="#404041" />
  //   </div>
  // ),
})

type SheetViewerProps = ComponentProps<typeof SheetViewerType>

const SheetViewerDynamic = (props: SheetViewerProps) => (
  <SheetViewerLazy {...props} />
)

export default SheetViewerDynamic
