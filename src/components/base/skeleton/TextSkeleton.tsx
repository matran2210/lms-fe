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
              className="animate-pulse border-1.5 border-default border-solid mt-6 p-6"
            >
              <div className="h-7 bg-gray-200 rounded-full dark:bg-gray-700 mb-3"></div>
              <div className="h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="flex items-center justify-between mt-5">
                <div className="w-20 h-6 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
                <div className="flex">
                  <div className="w-16 h-6 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full dark:bg-gray-700"></div>
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
