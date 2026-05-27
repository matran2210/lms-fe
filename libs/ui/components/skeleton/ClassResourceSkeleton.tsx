import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const ClassResourceSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx(
        'space-y-4 py-3 sm:space-y-6 sm:py-4 md:space-y-8',
        props.className,
      )}
    >
      {/* ===== Mobile app bar (base/sm — matches useTailwindBreakpoint isMobileView) ===== */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Skeleton.Avatar active size="small" className="shrink-0" />
          <Skeleton.Input
            active
            className="!h-7 !min-w-0 !w-full !max-w-[min(220px,100%)] !rounded-lg"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Skeleton.Button active className="!h-9 !w-9 !min-w-9 !p-0" />
          <Skeleton.Button active className="!h-9 !w-9 !min-w-9 !p-0" />
        </div>
      </div>

      {/* ===== Breadcrumb (desktop) ===== */}
      <Skeleton.Input
        active
        className="!hidden !h-4 !max-w-[320px] !rounded-full lg:!block"
      />

      {/* ===== Search ===== */}
      <Skeleton.Input
        active
        className="!h-10 !w-full !rounded-xl sm:!h-11"
      />

      {/* ===== Title + Filter (desktop only — matches class resource page) ===== */}
      <div className="hidden gap-4 md:flex md:flex-row md:items-center md:justify-between">
        <Skeleton.Input
          active
          className="!h-8 !w-full !max-w-[220px] !rounded-xl"
        />
        <div className="flex shrink-0 flex-wrap gap-2 sm:gap-3">
          <Skeleton.Button
            active
            className="!h-9 !w-[110px] !rounded-xl"
          />
          <Skeleton.Button
            active
            className="!h-9 !w-[140px] !rounded-xl"
          />
        </div>
      </div>

      {/* ===== List / cards (mobile) ===== */}
      <div className="rounded-xl bg-white p-3 shadow-card sm:p-4 md:hidden">
        <div className="flex flex-col divide-y divide-gray-100">
          {Array(6)
            .fill(null)
            .map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Skeleton.Avatar
                  active
                  shape="square"
                  className="!h-11 !w-11 shrink-0 !rounded-lg"
                />
                <div className="min-w-0 flex-1 space-y-2 py-0.5">
                  <Skeleton.Input
                    active
                    className="!h-4 !w-full !max-w-[95%] !rounded-md"
                  />
                  <Skeleton.Input
                    active
                    className="!h-3 !w-[72%] !max-w-full !rounded-md"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ===== Table (tablet+) ===== */}
      <div className="hidden overflow-hidden rounded-xl bg-white shadow-card md:block">
        <div className="grid grid-cols-5 gap-2 border-b px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 lg:gap-4 lg:px-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton.Input
              key={i}
              active
              className="!h-4 !min-w-0 !w-full !rounded-full"
            />
          ))}
        </div>

        {Array(6)
          .fill(null)
          .map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 gap-2 border-b px-3 py-3 last:border-b-0 sm:gap-3 sm:px-4 sm:py-4 lg:gap-4 lg:px-6"
            >
              {[0, 1, 2, 3, 4].map((col) => (
                <div key={col} className="min-w-0">
                  <Skeleton.Input
                    active
                    className={
                      col === 0
                        ? '!mx-auto !block !h-5 !w-6 !min-w-6 !rounded-full'
                        : '!h-5 !w-full !min-w-0 !rounded-lg'
                    }
                  />
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
})

export default ClassResourceSkeleton
