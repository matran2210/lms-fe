import { FC } from 'react'
import { QUIZ_ATTEMPT_STATUS } from 'src/constants'

type Props = {
  dataColumn?: QUIZ_ATTEMPT_STATUS
}
export const statusQuizMap = {
  SUBMITTED: {
    label: 'Submitted',
    color: 'text-green-1',
    bg: 'bg-green-2',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-3',
    bg: 'bg-blue-4',
  },
  UN_SUBMITTED: {
    label: 'Unsubmitted',
    color: 'text-danger-3',
    bg: 'text-danger-4',
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
