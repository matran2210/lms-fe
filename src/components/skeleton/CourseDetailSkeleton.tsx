import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const CourseDetailSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx('space-y-8 py-4', props.className)}
    >
      <div className="space-y-3">
        <Skeleton.Input
          active
          className="hidden !h-4 !w-[300px] !rounded-full lg:block"
        />
        <div className="flex items-center justify-between">
          <Skeleton.Input
            active
            className="!h-8 !w-[300px] !rounded-xl md:!w-[400px] "
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, cardIndex) => (
            <div
              key={cardIndex}
              className="flex h-[328px] flex-col gap-4 rounded-[28px] bg-white p-6 shadow-card md:h-[428px] lg:h-[456px]"
            >
              <div className="flex flex-col gap-3">
                <Skeleton.Input active className="!h-5 !w-24 !rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton.Input
                    active
                    className="!h-6 !w-10/12 !rounded-lg"
                  />
                  <Skeleton.Input active className="!h-5 !w-6/12 !rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton.Input active className="!h-4 !w-full !rounded-full" />
                <Skeleton.Input active className="!h-4 !w-9/12 !rounded-full" />
                <Skeleton.Input active className="!h-4 !w-8/12 !rounded-full" />
                <Skeleton.Input active className="!h-4 !w-7/12 !rounded-full" />
              </div>
              <Skeleton.Input active className="!h-4 !w-full !rounded-full" />
              <div className="flex items-center justify-between">
                <Skeleton.Input active className="!h-4 !w-4/12 !rounded-full" />
                <Skeleton.Button active className="!h-9 !w-24 !rounded-2xl" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
})

CourseDetailSkeleton.displayName = 'CourseDetailSkeleton'

export default CourseDetailSkeleton
