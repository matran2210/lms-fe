import { capitalizeFirstLetter } from '@lms/utils'
import clsx from 'clsx'

interface IProps {
  status: string
  className?: string
}
const StatusItem = ({ status, className = '' }: IProps) => {
  return (
    <span
      className={clsx(`rounded-[4px] px-2 py-1 text-xs font-medium`, className)}
    >
      {capitalizeFirstLetter(status)}
    </span>
  )
}

export default StatusItem
