import { FC } from 'react'

type Props = {
  dataColumn?: string | number
}

const NameNoActionCell: FC<Props> = ({ dataColumn }) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className="text-sm font-normal text-[#a1a1aa]">
        {dataColumn ?? '-'}
      </span>
    </div>
  </div>
)

export default NameNoActionCell
