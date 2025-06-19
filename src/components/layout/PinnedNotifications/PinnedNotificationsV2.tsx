import clsx from 'clsx'

const PinnedNotificationsV2 = ({
  children,
  bgColor = 'bg-primary-200',
  borderColor = 'border-primary',
}: {
  children: React.ReactNode
  bgColor?: string
  borderColor?: string
}) => {
  return (
    <div
      className={clsx(
        'flex h-auto w-full items-center justify-between rounded-lg border px-6 py-5',
        borderColor,
        bgColor,
      )}
    >
      {children}
    </div>
  )
}

export default PinnedNotificationsV2
