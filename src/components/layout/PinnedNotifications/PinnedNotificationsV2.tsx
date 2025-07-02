import clsx from 'clsx'

const PinnedNotificationsV2 = ({
  children,
  bgColor = 'bg-primary-200',
  borderColor = 'border-primary',
  classPinned = 'justify-between items-center',
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
        'flex w-full rounded-lg border px-6 py-4 lg:py-5',
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
