import ScheduleSkeleton from '@components/base/skeleton/ScheduleSkeleton'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import clsx from 'clsx'
import React from 'react'
interface IProps {
  title: string | undefined
  value: React.ReactNode | undefined
  isLoading?: boolean
  className?: string
}
const InfoItem = ({ title, value, isLoading = false, className }: IProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-[#99A1B7]">{title}</div>
      <div className={clsx('rounded-[4px] px-2 py-1 font-semibold', className)}>
        {isLoading ? <ScheduleSkeleton className="w-1/2" /> : <>{value}</>}
      </div>
    </div>
  )
}
export default InfoItem
