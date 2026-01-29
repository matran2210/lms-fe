import { IBadge } from 'src/type/courses-3-level'

const badgeTypeClasses: Record<string, string> = {
  open: 'text-accent-warning',
  pending: 'text-accent-warning',
  finished: 'text-[#087051] bg-[#E9FFEE]',
  reject: 'text-error bg-error_bg',
  denied: 'text-accent-error',
  canceled: 'text-accent',
  accepted: 'text-accent-success',
  active: 'text-accent-success bg-accent-success_bg',
  learning: 'text-[#FE9800] bg-[#FFF6E1]',
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
