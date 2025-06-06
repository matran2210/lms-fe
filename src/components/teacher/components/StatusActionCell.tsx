import { FC } from 'react'
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'

type Props = {
  dataColumn?: QUIZ_ATTEMPT_GRADING_STATUS | QUIZ_ATTEMPT_STATUS
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
  FINISHED: {
    label: 'Finished',
    color: 'text-green-1',
    bg: 'bg-green-2',
  },
  UN_FINISHED: {
    label: 'UnFinished',
    color: 'text-danger-3',
    bg: 'bg-danger-5',
  },
  AWAITING_GRADING: {
    label: 'Awaiting grading',
    color: 'text-orange-4',
    bg: 'bg-orange-1',
  },
  FINISHED_GRADING: {
    label: 'Finished Grading',
    color: 'text-blue-7',
    bg: 'bg-blue-900',
  },
  DRAFT: {
    label: 'Draft',
    color: 'text-gray-11',
    bg: 'bg-gray-100',
  },
}

const StatusQuizTag = ({ status }: { status: keyof typeof statusQuizMap }) => {
  const { label, color, bg } = statusQuizMap[status] || {
    label: '',
    color: '',
    bg: '',
  }

  if (!label || !color || !bg) return '_ _'
  return (
    <div
      className={`rounded px-2 py-1 text-xs font-medium ${color || ''} ${bg || ''} w-fit`}
    >
      {label}
    </div>
  )
}
const StatusActionCell: FC<Props> = ({ dataColumn }) => (
  <StatusQuizTag status={dataColumn as keyof typeof statusQuizMap} />
)

export default StatusActionCell
