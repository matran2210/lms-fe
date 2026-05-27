import { Skeleton } from 'antd'
import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

const FOLDER_CARD_COUNT = 6
const FILE_CARD_COUNT = 10
const gridClassName = 'grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5'

const SectionHeaderSkeleton = () => (
  <div className="flex items-center gap-3">
    <Skeleton.Input active className="!h-[27px] !w-[72px] !rounded-lg" />
  </div>
)

const FolderCardSkeleton = () => (
  <Skeleton.Input active className="!h-11 !w-full !rounded-lg md:!h-12" />
)

const FileCardSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-lg bg-gray-100 p-2 md:p-3">
    <div className="flex items-center gap-2">
      <Skeleton.Input active className="!h-4 !min-w-0 !flex-1 !rounded-md" />
    </div>
    <Skeleton.Node active className="!h-24 !w-full !rounded-lg" />
  </div>
)

const ClassResourceGridSkeleton = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx(
        'mb-4 flex flex-col gap-6 rounded-xl bg-white p-4 shadow-small md:p-6 xl:p-8',
        props.className,
      )}
    >
      <section className="flex flex-col gap-4">
        <SectionHeaderSkeleton />
        <div className={gridClassName}>
          {Array.from({ length: FOLDER_CARD_COUNT }).map((_, i) => (
            <FolderCardSkeleton key={i} />
          ))}
        </div>
      </section>
      <section className="flex flex-col">
        <div className="mb-4">
          <SectionHeaderSkeleton />
        </div>
        <div className={gridClassName}>
          {Array.from({ length: FILE_CARD_COUNT }).map((_, i) => (
            <FileCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  )
})

ClassResourceGridSkeleton.displayName = 'ClassResourceGridSkeleton'

export default ClassResourceGridSkeleton
