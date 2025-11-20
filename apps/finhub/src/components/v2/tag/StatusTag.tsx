import { statusMap } from 'src/constants'

export const StatusTag = ({ status }: { status: keyof typeof statusMap }) => {
  const { label, color, bg } = statusMap[status] || statusMap.COMPLETED
  return (
    <span className={`rounded p-2 text-sm font-semibold  ${color} ${bg}`}>
      {label}
    </span>
  )
}
