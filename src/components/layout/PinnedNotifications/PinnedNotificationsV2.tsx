import clsx from 'clsx'

const PinnedNotificationsV2 = ({
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
        'flex w-full rounded-xl border p-4 md:rounded-lg md:px-6 md:py-4 lg:py-5',
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

export default PinnedNotificationsV2
