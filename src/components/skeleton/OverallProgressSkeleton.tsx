import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const OverallProgressSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(props.className)}>
      <div className="rounded-2xl bg-white p-6 shadow-small">
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

OverallProgressSkeleton.displayName = 'OverallProgressSkeleton'

export default OverallProgressSkeleton
