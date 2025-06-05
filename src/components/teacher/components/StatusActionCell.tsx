import { FC } from 'react'
import { QUIZ_ATTEMPT_STATUS } from 'src/constants'

type Props = {
  dataColumn?: QUIZ_ATTEMPT_STATUS
}
export const statusQuizMap = {
  SUBMITTED: {
    label: 'Submitted',
    color: 'text-[#07af17]',
    bg: 'bg-[#01711f0D]',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-[#025eff]',
    bg: 'bg-[#025eff0D]',
  },
  UN_SUBMITTED: {
    label: 'Unsubmitted',
    color: 'text-[#f01919]',
    bg: 'text-[#0Df01919]',
  },
}

const StatusQuizTag = ({ status }: { status: keyof typeof statusQuizMap }) => {
  const { label, color, bg } = statusQuizMap[status] || statusQuizMap.SUBMITTED
  return (
    <div
      className={`text-xs rounded px-2 py-1 font-medium ${color} ${bg} w-fit`}
    >
      {label}
    </div>
  )
}
const StatusActionCell: FC<Props> = ({ dataColumn }) => (
  <StatusQuizTag status={dataColumn as keyof typeof statusQuizMap} />
)

export default StatusActionCell
