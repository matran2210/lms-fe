import clsx from 'clsx'
import { FC } from 'react'

type Props = {
  data?: React.ReactNode
  className?: string
  onClick?: () => void
}

const TableCell: FC<Props> = ({ data, className, onClick = () => {} }) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className={clsx('text-gray-800', className)} onClick={onClick}>
        {data ?? '-'}
      </span>
    </div>
  </div>
)

export default TableCell
