"use client"
import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

export const OverallProgressSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(props.className)}>
      <div className="rounded-2xl bg-white p-4 shadow-small md:p-6">
        <div className="flex-col">
          <div className="flex">
            <div className="mb-6 min-w-fit text-lg font-semibold md:text-xl xl:mb-0">
              <Skeleton.Input style={{ width: 180 }} active size="small" />
            </div>
            <div className="ms-2">
              <Skeleton.Avatar shape="circle" size={20} active />
            </div>
          </div>
        </div>
        <div className="flex-row justify-around gap-2 md:flex 4xl:gap-8">
          <div className="flex items-center justify-center">
            <Skeleton.Avatar shape="circle" size={250} active />
          </div>
          <div className="mt-6 flex min-w-[180px] flex-col justify-center gap-3 md:mt-0">
            <div className="flex items-center gap-2">
              <Skeleton.Avatar shape="circle" size={24} active />
              <Skeleton.Input style={{ width: 160 }} active size="small" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton.Avatar shape="circle" size={24} active />
              <Skeleton.Input style={{ width: 180 }} active size="small" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Skeleton.Avatar shape="circle" size={24} active />
              <Skeleton.Input style={{ width: 220 }} active size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export const OvervallProgressSkeletonMobile = () => {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl bg-white p-4 shadow-small md:p-6">
        <div className="flex flex-col gap-6">
          <div className="h-6 w-3/4 rounded bg-skeleton"></div>
          <div className="flex flex-col items-center justify-around gap-7 md:flex-row">
            <div className="h-[200px] w-[200px] rounded-full bg-skeleton"></div>
            <div className="flex w-full flex-col gap-3 md:w-[180px]">
              <div className="h-5 w-full rounded bg-skeleton"></div>
              <div className="h-5 w-full rounded bg-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

OverallProgressSkeleton.displayName = 'OverallProgressSkeleton'

export default OverallProgressSkeleton
