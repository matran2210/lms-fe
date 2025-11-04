import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const DashboardSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} {...props} className={clsx(props.className)}>
      <div className="flex w-full flex-col gap-4 bg-[#F9F9F9] md:gap-6 xl:gap-8">
        <div className="grid xl:grid-cols-2 xl:gap-8">
          <div className="rounded-2xl bg-white p-4 shadow-small md:p-6">
            <div className="mb-6 flex items-center">
              <Skeleton.Input style={{ width: 180 }} active size="small" />
              <div className="ms-2">
                <Skeleton.Avatar shape="circle" size={20} active />
              </div>
            </div>
            <div className="flex-row justify-around gap-2 md:flex 4xl:gap-8">
              <div className="flex items-center justify-center">
                <Skeleton.Avatar shape="circle" size={240} active />
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 xl:gap-8">
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

        <div className="grid lg:flex xl:gap-8 2xl:mb-8">
          <div className="order-2 xl:order-1 xl:w-[60%]">
            <div className="rounded-2xl bg-white p-4 shadow-small md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton.Input style={{ width: 200 }} active size="small" />
                <Skeleton.Input style={{ width: 100 }} active size="small" />
              </div>
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div className="flex items-center justify-between" key={i}>
                      <Skeleton.Input
                        style={{ width: '55%' }}
                        active
                        size="small"
                      />
                      <Skeleton.Input
                        style={{ width: 80 }}
                        active
                        size="small"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="order-1 mb-6 flex h-auto rounded-2xl bg-white p-4 shadow-small md:p-6 xl:order-2 xl:my-0 xl:w-[40%]">
            <div className="w-full">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton.Input style={{ width: 200 }} active size="small" />
                  <div className="ms-2">
                    <Skeleton.Avatar shape="circle" size={20} active />
                  </div>
                </div>
                <Skeleton.Input style={{ width: 140 }} active size="small" />
              </div>
              <div className="flex items-center justify-center">
                <Skeleton.Avatar shape="circle" size={320} active />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2.5">
                <span className="min-h-3 min-w-3 rounded-full bg-gray-300"></span>
                <Skeleton.Input style={{ width: 160 }} active size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

DashboardSkeleton.displayName = 'DashboardSkeleton'

export default DashboardSkeleton
