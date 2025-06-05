import ScheduleSkeleton from '@components/base/skeleton/ScheduleSkeleton'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import React from 'react'
interface IProps {
  title: string | undefined
  value: React.ReactNode | undefined
  isLoading?: boolean
}
const PrimaryInfoItem = ({ title, value, isLoading = false }: IProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <span className="text-sm text-[#99A1B7]">{title}</span>
      </div>
      <div className="col-span-2">
        {isLoading ? <ScheduleSkeleton className="w-1/2" /> : <>{value}</>}
      </div>
    </div>
  )
}
export default PrimaryInfoItem
