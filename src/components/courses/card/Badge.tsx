import { IBadge } from 'src/type/courses-3-level'

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
        className={`inline-block h-[26px] min-w-[50px] text-center rounded-sm px-2 py-0.5 text-sm ${isBold ? 'font-medium' : 'font-normal'} leading-5.5 ${typeClass}`}
      >
        {label}
      </span>
    </div>
  )
}
