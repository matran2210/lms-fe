import React, { ReactNode } from 'react'
import { SkeletonProps } from './type'

const ActivitySkeleton: React.FunctionComponent<SkeletonProps> = ({
  children,
  loading,
  length = 1,
  widths,
  className,
}) => {
  const mockData = new Array(widths?.length ? widths.length : length).fill(0)
  return (
    <>
      {loading ? (
        <>
          {mockData.map((data, index) => (
            <div
              key={index}
              role="status"
              className={'animate-pulse mt-6 p-6' + ' ' + className}
            >
              <div className="h-60 bg-gray-200 rounded-md dark:bg-gray-700 mb-6"></div>
              <div className="h-7 bg-gray-200 rounded-md dark:bg-gray-700 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 mb-6"></div>
              <div className="h-7 bg-gray-200 rounded-md dark:bg-gray-700 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 mb-6"></div>
              <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700 mb-3"></div>
            </div>
          ))}
        </>
      ) : (
        children
      )}
    </>
  )
}

export default ActivitySkeleton
