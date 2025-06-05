import React, { ReactNode } from 'react'
import { SkeletonProps } from './type'
import clsx from 'clsx'

const ActivitySkeleton: React.FunctionComponent<SkeletonProps> = ({
  children,
  loading,
  length = 1,
  widths,
  className,
  classChild,
}) => {
  const mockData = new Array(widths?.length ? widths.length : length).fill(0)
  return (
    <>
      {loading ? (
        <div className={clsx(className)}>
          {mockData.map((_, index) => (
            <div
              key={index}
              role="status"
              className={clsx('animate-pulse p-6', classChild)}
            >
              <div className="mb-6 h-60 bg-[#F1F1F1]"></div>
              <div className="mb-3 h-7 bg-[#F1F1F1]"></div>
              <div className="mb-6 h-4 bg-[#F1F1F1]"></div>
              <div className="mb-3 h-7 bg-[#F1F1F1]"></div>
              <div className="mb-6 h-4 bg-[#F1F1F1]"></div>
              <div className="mb-3 h-30 bg-[#F1F1F1]"></div>
            </div>
          ))}
        </div>
      ) : (
        children
      )}
    </>
  )
}

export default ActivitySkeleton
