import { FC } from 'react'

type Props = {
  dataColumn?: string | number
  className?: string
}

const NameNoActionCell: FC<Props> = ({
  dataColumn,
  className = 'text-sm font-normal text-gray-400',
}) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className={className}>{dataColumn ?? '-'}</span>
    </div>
  </div>
)

export default NameNoActionCell
