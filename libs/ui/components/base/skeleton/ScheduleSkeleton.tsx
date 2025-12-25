import clsx from 'clsx'
import React from 'react'

interface IProps {
  className?: string
}
const ScheduleSkeleton = ({ className }: IProps) => {
  return (
    <div role="status" className={clsx('animate-pulse', className)}>
      <div className="mb-3 h-6 w-1/2 bg-[#F1F1F1]"></div>
    </div>
  )
}

export default ScheduleSkeleton
