import { FC } from 'react'

type Props = {
  data?: string | number
  linkView?: string
}

const NameActionCell: FC<Props> = ({ data, linkView }) => (
  <a href={linkView || '#'} className="flex items-center">
    <div className="flex flex-col">
      <span className="text-sm font-normal text-gray-800 hover:text-primary">
        {data ?? '-'}
      </span>
    </div>
  </a>
)

export default NameActionCell
