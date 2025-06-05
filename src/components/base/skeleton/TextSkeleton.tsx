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
              className="border-1.5 mt-6 animate-pulse border-solid border-[#DCDDDD] p-6"
            >
              <div className="dark:bg-gray-700 mb-3 h-7 rounded-full bg-[#e5e7eb]"></div>
              <div className="dark:bg-gray-700 h-7 rounded-full bg-[#e5e7eb]"></div>
              <div className="mt-5 flex items-center justify-between">
                <div className="dark:bg-gray-700 me-3 h-6 w-20 rounded-full bg-[#e5e7eb]"></div>
                <div className="flex">
                  <div className="dark:bg-gray-700 me-3 h-6 w-16 rounded-full bg-[#e5e7eb]"></div>
                  <div className="dark:bg-gray-700 h-6 w-16 rounded-full bg-[#e5e7eb]"></div>
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
