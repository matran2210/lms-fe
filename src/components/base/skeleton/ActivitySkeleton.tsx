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
              <div className="h-60 bg-gray-3 mb-6"></div>
              <div className="h-7 bg-gray-3 mb-3"></div>
              <div className="h-4 bg-gray-3 mb-6"></div>
              <div className="h-7 bg-gray-3 mb-3"></div>
              <div className="h-4 bg-gray-3 mb-6"></div>
              <div className="h-30 bg-gray-3 mb-3"></div>
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
