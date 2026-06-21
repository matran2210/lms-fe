import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const LIST_ROW_COUNT = 5

const ListRowSkeleton = () => (
  <div className="flex gap-3 py-1">
    <Skeleton.Avatar
      active
      shape="square"
      className="!h-11 !w-11 shrink-0 !rounded-lg"
    />
    <div className="min-w-0 flex-1 space-y-2 py-0.5">
      <Skeleton.Input active className="!h-4 !w-full !max-w-[95%] !rounded-md" />
      <Skeleton.Input active className="!h-3 !w-[72%] !max-w-full !rounded-md" />
    </div>
  </div>
)

const SectionSkeleton = ({ rowCount = LIST_ROW_COUNT }: { rowCount?: number }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton.Input active className="!h-[27px] !w-[72px] !rounded-lg" />
      <Skeleton.Input active className="!h-[26px] !w-10 !rounded" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: rowCount }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  </section>
)

const ClassResourceMobileListSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx('mb-6 mt-4 space-y-6', props.className)}
    >
      <SectionSkeleton rowCount={3} />
      <SectionSkeleton rowCount={LIST_ROW_COUNT} />
    </div>
  )
})

ClassResourceMobileListSkeleton.displayName = 'ClassResourceMobileListSkeleton'

export default ClassResourceMobileListSkeleton
