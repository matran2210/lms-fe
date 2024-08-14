import { SkeletonProps } from './type'

const TextSkeleton = ({
  children,
  loading,
  length = 1,
  widths,
}: SkeletonProps) => {
  const mockData = new Array(widths?.length ? widths.length : length).fill(0)
  return (
    <>
      {loading ? (
        <>
          {mockData.map((_, index) => (
            <div
              key={index}
              role="status"
              className="mt-6 animate-pulse border-1.5 border-solid border-default p-6"
            >
              <div className="mb-3 h-7 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-7 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mt-5 flex items-center justify-between">
                <div className="me-3 h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex">
                  <div className="me-3 h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        </>
      ) : (
        children
      )}
    </>
  )
}

export default TextSkeleton
