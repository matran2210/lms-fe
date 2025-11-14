import clsx from 'clsx'
import React from 'react'
import { SkeletonProps } from './type'

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
              className={clsx('animate-pulse p-3 xl:p-6', classChild)}
            >
              <div className="mb-6 h-60 rounded-lg bg-gray-3"></div>
              <div className="mb-3 h-7 rounded-lg bg-gray-3"></div>
              <div className="mb-6 h-4 rounded-lg bg-gray-3"></div>
              <div className="mb-3 h-7 rounded-lg bg-gray-3"></div>
              <div className="mb-6 h-4 rounded-lg bg-gray-3"></div>
              <div className="mb-3 h-[7.5rem] rounded-lg bg-gray-3"></div>
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
