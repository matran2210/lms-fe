import clsx from 'clsx'
import { FC } from 'react'

type Props = {
  dataColumn?: string | number
  className?: string
  isCenter?: boolean
}

const NameNoActionCell: FC<Props> = ({
  dataColumn,
  isCenter = false,
  className = 'text-sm font-normal text-gray-800',
}) => (
  <div className={clsx('flex items-center', isCenter && 'justify-center')}>
    <div className="flex flex-col">
      <span className={clsx(className, isCenter && 'text-center')}>
        {dataColumn ?? '-'}
      </span>
    </div>
  </div>
)

export default NameNoActionCell
