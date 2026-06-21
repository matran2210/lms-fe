import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const TABLE_ROW_COUNT = 6
const TABLE_COL_COUNT = 5

const TableSectionSkeleton = ({ rowCount = TABLE_ROW_COUNT }: { rowCount?: number }) => (
  <>
    <div className="flex items-center gap-3 p-8 pb-0">
      <Skeleton.Input active className="!h-[27px] !w-[88px] !rounded-lg" />
      <Skeleton.Input active className="!h-[26px] !w-10 !rounded" />
    </div>
    <div className="px-2 pb-4 pt-2 sm:px-4">
      <div className="grid grid-cols-5 gap-2 border-b px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 lg:gap-4 lg:px-6">
        {Array.from({ length: TABLE_COL_COUNT }).map((_, i) => (
          <Skeleton.Input
            key={i}
            active
            className="!h-4 !min-w-0 !w-full !rounded-full"
          />
        ))}
      </div>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 gap-2 border-b px-3 py-3 last:border-b-0 sm:gap-3 sm:px-4 sm:py-4 lg:gap-4 lg:px-6"
        >
          {Array.from({ length: TABLE_COL_COUNT }).map((_, col) => (
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
  </>
)

const ClassResourceTableListSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx(
        'mb-4 flex flex-col rounded-xl bg-white shadow-small',
        props.className,
      )}
    >
      <TableSectionSkeleton rowCount={4} />
      <TableSectionSkeleton rowCount={TABLE_ROW_COUNT} />
      <div className="flex justify-end p-8 pt-2">
        <Skeleton.Input active className="!h-8 !w-[280px] !rounded-lg" />
      </div>
    </div>
  )
})

ClassResourceTableListSkeleton.displayName = 'ClassResourceTableListSkeleton'

export default ClassResourceTableListSkeleton
