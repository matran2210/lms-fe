import { IBadge } from '@lms/core'

const badgeTypeClasses: Record<string, string> = {
  open: 'text-badge-open',
  pending: 'text-badge-pending',
  finished: 'text-badge-finished bg-badge-finished_bg',
  reject: 'text-badge-reject bg-badge-reject_bg',
  denied: 'text-badge-denied',
  canceled: 'text-badge-canceled',
  accepted: 'text-badge-accepted',
  active: 'text-badge-active bg-badge-active_bg',
  learning: 'text-badge-learning bg-badge-learning_bg',
}

export default function Badge({ label, badgeType, isBold = false }: IBadge) {
  const typeClass = badgeType ? (badgeTypeClasses[badgeType] ?? '') : ''

  return (
    <div className="flex items-center">
      <span
        className={`inline-block h-[26px] min-w-[50px] rounded-[4px] px-1 py-0.5 text-center text-sm md:px-1.5 md:py-0.5 ${isBold ? 'font-medium' : 'font-normal'} leading-5.5 ${typeClass}`}
      >
        {label}
      </span>
    </div>
  )
}
