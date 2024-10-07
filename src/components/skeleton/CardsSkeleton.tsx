import { Skeleton } from 'antd'
import React from 'react'

const CardsSkeleton = () => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-6 xl-max:px-6 2xl-min:grid-cols-3">
      {Array(9)
        .fill([])
        .map((_, index) => (
          <div
            className={`item flex flex-col bg-white p-7.5 shadow-sidebar`}
            key={index}
          >
            <div className={`flex min-h-352 flex-col`}>
              <Skeleton />
              <Skeleton.Button className="mt-auto self-end" />
            </div>
          </div>
        ))}
    </div>
  )
}

export default CardsSkeleton
