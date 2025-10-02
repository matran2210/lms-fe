import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const CourseSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(props.className)}>
      <div className="main relative">
        <div className="flex w-full items-center justify-between pb-4">
          <div className="h-10 w-5/12 animate-pulse rounded-md bg-skeleton" />
          <div className="h-10 w-2/12 animate-pulse rounded-md bg-skeleton" />
        </div>
      </div>
      <div className="heading flex bg-white">
        <div className="w-full justify-between p-7.5 shadow-sidebar 2xl:flex 2xl:py-4.5">
          <h1 className="line-clamp-1 w-1/2 text-2xl font-light text-[#050505]">
            <div className="h-10 w-full animate-pulse rounded-md bg-skeleton" />
          </h1>
        </div>
      </div>
      <div className="pt-6">
        <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array(9)
            .fill([])
            .map((_, index) => (
              <div
                className={`item flex flex-col rounded-md bg-white p-[30px] shadow-sidebar`}
                key={index}
              >
                <div className={`flex min-h-[352px] flex-col`}>
                  <div className="h-10 w-full animate-pulse rounded-md bg-skeleton" />
                  <div className="mt-10 h-36 w-full animate-pulse rounded-md bg-skeleton" />
                </div>
                <div className="flex justify-end">
                  <div className="flex h-10 w-3/12 animate-pulse justify-end rounded-md bg-skeleton text-end" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
})

CourseSkeleton.displayName = 'CourseSkeleton'

export default CourseSkeleton
