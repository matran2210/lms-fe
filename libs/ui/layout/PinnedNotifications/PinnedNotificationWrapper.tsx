import clsx from 'clsx'

const PinnedNotificationWrapper = ({
  children,
  bgColor = 'bg-primary-200',
  borderColor = 'border-primary',
  classPinned = 'items-center justify-between',
  heightPinned = 'h-auto',
}: {
  children: React.ReactNode
  bgColor?: string
  borderColor?: string
  classPinned?: string
  heightPinned?: string
}) => {
  return (
    <div
      className={clsx(
        'flex w-full rounded-xl border p-4 opacity-90 md:rounded-lg md:px-6 md:py-3 lg:py-[15px]',
        heightPinned,
        classPinned,
        borderColor,
        bgColor,
      )}
    >
      {children}
    </div>
  )
}

export default PinnedNotificationWrapper
