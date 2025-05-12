import clsx from 'clsx'
import { BADGE_TYPES } from 'src/constants'

interface SAPPBadgeProps {
  label: string | React.ReactNode
  type?: keyof typeof BADGE_TYPES
  className?: string
}

const badgeTypeToClass = {
  error: 'bg-accent-error/5 text-accent-error',
  warning: 'bg-accent-warning/5 text-accent-warning',
  info: 'bg-accent-info/5 text-accent-info',
  success: 'bg-accent-success/5 text-accent-success',
  default: 'bg-accent-default/5 text-accent-default',
} as const

function SAPPBadge({ className, label, type = 'default' }: SAPPBadgeProps) {
  return (
    <div
      className={clsx(
        'w-20 rounded px-2 py-1 text-center text-ssm',
        badgeTypeToClass[type],
        className,
      )}
    >
      {label}
    </div>
  )
}

export default SAPPBadge
