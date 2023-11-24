import React from 'react'

type Props = {
  children?: any
  loading?: boolean
  height?: string
  width?: string
}

const TextSkeleton = ({
  children,
  loading,
  height = '2.5',
  width = 'full',
}: Props) => {
  return (
    <>
      {!loading ? (
        children
      ) : (
        <div role="status" className="animate-pulse">
          <div
            className={` h-${height} max-w-${width} bg-gray-300 rounded-full dark:bg-gray-700`}
          ></div>

          <span className="sr-only">Loading...</span>
        </div>
      )}
    </>
  )
}

export default TextSkeleton
