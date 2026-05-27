/**
 * HookFormExcelDynamic — lazy wrapper cho HookFormExcel
 *
 * @fortune-sheet/react rất nặng, chỉ cần load khi câu hỏi
 * có response_option === SHEET.
 */
'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type HookFormExcelType from './HookFormExcel'
import { LoadingIcon } from '@lms/assets'

const HookFormExcelLazy = dynamic(() => import('./HookFormExcel'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center">
      <LoadingIcon stroke="#404041" />
    </div>
  ),
})

type HookFormExcelProps = ComponentProps<typeof HookFormExcelType>

const HookFormExcelDynamic = (props: HookFormExcelProps) => (
  <HookFormExcelLazy {...props} />
)

export default HookFormExcelDynamic
