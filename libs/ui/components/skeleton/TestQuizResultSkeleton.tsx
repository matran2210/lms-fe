import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const TestQuizResultSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx('space-y-6 py-4', props.className)}
    >
      {/* Breadcrumb */}
      <Skeleton.Input
        active
        className="!hidden !h-4 !w-[320px] !rounded-full lg:!block"
      />

      {/* HeaderMobile / Title */}
      <div className="flex items-center justify-between">
        <Skeleton.Input
          active
          className="!h-8 !w-[220px] !rounded-xl"
        />

        <Skeleton.Button
          active
          className="!h-9 !w-9 !rounded-full md:!hidden"
        />
      </div>

      {/* Filter area placeholder */}
      <div className="flex justify-end gap-3">
        <Skeleton.Button
          active
          className="!h-9 !w-[120px] !rounded-xl"
        />
        <Skeleton.Button
          active
          className="!h-9 !w-[140px] !rounded-xl"
        />
      </div>

      {/* Table container skeleton */}
      <div className="rounded-xl bg-white shadow-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 border-b px-6 py-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton.Input
              key={i}
              active
              className="!h-4 !w-full !rounded-full"
            />
          ))}
        </div>

        {/* Rows */}
        {Array(5)
          .fill(null)
          .map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-4 gap-4 border-b px-6 py-4 last:border-b-0"
            >
              <Skeleton.Input active className="!h-5 !w-8/12 !rounded-lg" />
              <Skeleton.Input active className="!h-5 !w-6/12 !rounded-lg" />
              <Skeleton.Input active className="!h-5 !w-7/12 !rounded-lg" />
              <Skeleton.Input active className="!h-5 !w-5/12 !rounded-lg" />
            </div>
          ))}
      </div>
    </div>
  )
})

TestQuizResultSkeleton.displayName = 'TestQuizResultSkeleton'

export default TestQuizResultSkeleton
