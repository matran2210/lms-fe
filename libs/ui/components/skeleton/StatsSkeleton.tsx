import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const StatsSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(props.className)}>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 xl:gap-8">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <div
              className="w-full rounded-2xl bg-white p-5 shadow-small md:p-6"
              key={idx}
            >
              <div className="flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-200" />
                <div className="ms-4 w-full">
                  <div className="text-lg font-semibold text-gray-800">
                    <Skeleton.Input
                      style={{ width: '60%' }}
                      active
                      size="small"
                    />
                  </div>
                  <div className="mt-4 text-base font-medium text-gray-400 xl:mt-[22px]">
                    <Skeleton.Input
                      style={{ width: '40%' }}
                      active
                      size="small"
                    />
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 xl:mt-1">
                    <div className="h-full w-1/2 rounded-full bg-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
})

StatsSkeleton.displayName = 'StatsSkeleton'

export default StatsSkeleton
