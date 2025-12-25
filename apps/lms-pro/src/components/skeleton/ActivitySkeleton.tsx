import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const ActivitySkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx('py-4', props.className)}>
      <div className="mb-6 space-y-3">
        <Skeleton.Input active className="!h-6 !w-1/2 !rounded-lg" block />
        <div className="flex items-center justify-between gap-2">
          <Skeleton.Input
            active
            className="!h-5 !w-[200px] !rounded-lg"
            block
          />
        </div>
      </div>
      <div className="mb-6 rounded-xl bg-white p-4 shadow-small">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton.Input
              active
              className="!h-6 !w-[180px] !rounded-lg"
              block
            />
            <div className="flex flex-col space-y-2">
              <Skeleton.Input
                active
                className="!h-4 !w-[150px] !rounded-lg"
                block
              />
              <Skeleton.Input
                active
                className="!h-4 !w-[120px] !rounded-lg"
                block
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton.Avatar
              shape="square"
              size={20}
              active
              className="!rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-small">
        <div className="mb-6 flex flex-wrap items-center gap-6">
          <Skeleton.Input active className="!h-8 !w-[150px] !rounded-lg" />
          <Skeleton.Input active className="!h-8 !w-[150px] !rounded-lg" />
          <Skeleton.Input active className="!h-8 !w-[150px] !rounded-lg" />
        </div>

        <div className="h-[calc(100vh-390px)] space-y-2 overflow-hidden">
          {Array.from({ length: 17 }).map((_, index) => {
            const widths = [
              '100%',
              '95%',
              '85%',
              '100%',
              '90%',
              '75%',
              '100%',
              '80%',
              '100%',
              '88%',
              '92%',
              '78%',
              '100%',
              '85%',
              '70%',
              '65%',
              '60%',
              '55%',
              '50%',
              '45%',
              '40%',
              '35%',
              '30%',
              '25%',
            ]
            return (
              <Skeleton.Input
                key={index}
                active
                className="!h-4 !rounded-lg"
                style={{ width: widths[index] }}
                block
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

ActivitySkeleton.displayName = 'ActivitySkeleton'

export default ActivitySkeleton
