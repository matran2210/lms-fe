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
          <Skeleton.Input size={'small'} active={true} />
          <Skeleton.Input size={'small'} active={true} />
        </div>
      </div>
      <div className="heading flex bg-white">
        <div className="w-full justify-between px-7.5 py-7.5 shadow-sidebar 2xl-min:flex 2xl-min:py-4.5">
          <h1 className="line-clamp-1 w-1/2 text-2xl font-light text-[#050505]">
            <Skeleton.Button size={'large'} block={true} />
          </h1>
        </div>
      </div>
      <div className="pt-6">
        <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array(9)
            .fill([])
            .map((_, index) => (
              <div
                className={`item flex flex-col bg-white p-7.5 shadow-sidebar`}
                key={index}
              >
                <div className={`flex min-h-352 flex-col`}>
                  <Skeleton />
                  <Skeleton.Button className="mt-auto self-end" />
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
