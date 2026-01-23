import clsx from 'clsx'
import { BADGE_TYPES } from '@lms/core'

interface SAPPBadgeProps {
  label: string | React.ReactNode
  type?: keyof typeof BADGE_TYPES
  className?: string
}

const badgeTypeToClass = {
  error: 'bg-error/5 text-error',
  warning: 'bg-warning/5 text-warning',
  info: 'bg-info/5 text-info',
  success: 'bg-success/5 text-success',
  default: 'bg-accent/5 text-accent',
} as const

function SAPPBadge({ className, label, type = 'default' }: SAPPBadgeProps) {
  return (
    <div
      className={clsx(
        'w-20 rounded px-2 py-1 text-center text-xs',
        badgeTypeToClass[type],
        className,
      )}
    >
      {label}
    </div>
  )
}

export default SAPPBadge
