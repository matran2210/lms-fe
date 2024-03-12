import React from 'react'

type Props = {
  children?: any
  loading?: boolean
  height?: string
  width?: string
  length?: number
  className?: string
  classChild?: string
  widths?: string[]
}

const TextSkeleton = ({
  children,
  loading,
  height = '2.5',
  width = 'full',
  length = 1,
  className = '',
  classChild = '',
  widths,
}: Props) => {
  const mockData = new Array(widths?.length ? widths.length : length).fill(0)
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
                style={{
                  width: `${widths?.[index]}%`,
                }}
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
