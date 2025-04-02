import clsx from 'clsx'
import { FC, ReactElement } from 'react'

type Props = {
  data?: React.ReactNode
  className?: string
}

const TableCell: FC<Props> = ({ data, className }) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className={clsx('text-gray-800', className)}>{data ?? '-'}</span>
    </div>
  </div>
)

export default TableCell
