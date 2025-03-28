import { FC } from 'react'

type Props = {
  data?: string | number
}

const NameNoActionCell: FC<Props> = ({ data }) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className="text-sm font-normal text-gray-400">{data ?? '-'}</span>
    </div>
  </div>
)

export default NameNoActionCell
