import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

export const WeeklyReportSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(props.className)}>
      <div className="flex w-full flex-col gap-4 bg-[#F9F9F9] md:gap-6 xl:gap-8">
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-small md:p-6 xl:mt-0">
          <div className="mb-4">
            <Skeleton.Input style={{ width: 300 }} active size="small" />
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-4">
            <div className="flex items-center gap-4">
              <Skeleton.Avatar shape="square" size={32} active />
              <Skeleton.Input style={{ width: 220 }} active size="small" />
            </div>
            <Skeleton.Input style={{ width: 260 }} active size="small" />
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-lg bg-gray-100 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton.Avatar shape="square" size={32} active />
                <Skeleton.Input style={{ width: 240 }} active size="small" />
              </div>
              <Skeleton.Input style={{ width: 80 }} active size="small" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton.Input style={{ width: 240 }} active size="small" />
              <Skeleton.Input style={{ width: 120 }} active size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export const WeeklyReportSkeletonMobile = () => {
  return (
    <div className="animate-pulse rounded-2xl p-4 md:p-6 lg:col-span-5">
      <div className="mb-6 flex flex-col md:mb-5 md:pb-3">
        <div className="mb-1 flex gap-2">
          <div className="h-6 w-24 rounded bg-skeleton"></div>
          <div className="h-6 w-44 rounded bg-skeleton"></div>
        </div>
        <div className="h-4 w-36 rounded bg-skeleton"></div>
      </div>

      <div className="flex flex-col rounded-lg bg-gray-100 p-4">
        <div className="mb-2 flex flex-row items-center gap-4">
          <div className="h-8 w-8 rounded-md bg-gray-300"></div>
          <div className="h-5 w-52 rounded bg-skeleton"></div>
        </div>
        <div className="h-4 w-64 rounded bg-skeleton"></div>
      </div>

      <div className="mt-4 flex flex-col rounded-lg bg-gray-100 p-4 md:mt-6">
        <div className="mb-2 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-md bg-gray-300"></div>
            <div className="h-5 w-56 rounded bg-skeleton"></div>
          </div>
          <div className="h-4 w-10 rounded bg-skeleton"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-64 rounded bg-skeleton"></div>
        </div>
      </div>
    </div>
  )
}

WeeklyReportSkeleton.displayName = 'WeeklyReportSkeleton'

export default WeeklyReportSkeleton
