import clsx from 'clsx'

const PinnedNotificationsV2 = ({
  LeftContent,
  CenterContent,
  RightContent,
  bgColor = 'bg-primary-200',
  borderColor = 'border-primary',
}: {
  LeftContent: React.ReactNode
  CenterContent: React.ReactNode
  RightContent: React.ReactNode
  bgColor?: string
  borderColor?: string
}) => {
  return (
    <div
      className={clsx(
        'flex h-7 w-full items-center justify-between border',
        borderColor,
        bgColor,
      )}
    >
      <div>{LeftContent}</div>
      <div>{CenterContent}</div>
      <div>{RightContent}</div>
    </div>
  )
}

export default PinnedNotificationsV2
