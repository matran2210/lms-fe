import React from 'react'

type Props = {
  children?: any
  loading?: boolean
  height?: string
  width?: string
  length?: number
  className?: string
  classChild?: string
}

const TextSkeleton = ({
  children,
  loading,
  height = '2.5',
  width = 'full',
  length = 1,
  className = '',
  classChild = '',
}: Props) => {
  const mockData = new Array(length).fill(0)
  return (
    <>
      {!loading ? (
        children
      ) : (
        <>
          {mockData.map((data, index) => (
            <div
              key={index}
              role="status"
              className={`animate-pulse ${className}`}
            >
              <div
                className={`h-${height} max-w-${width} bg-gray-300 ${
                  classChild ? classChild : 'rounded-full'
                } dark:bg-gray-700`}
              ></div>
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default TextSkeleton
