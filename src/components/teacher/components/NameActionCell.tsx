import Link from 'next/link'
import { FC } from 'react'

type Props = {
  dataColumn?: string | number
  linkView?: string
}

const NameActionCell: FC<Props> = ({ dataColumn, linkView }) => (
  <Link href={linkView || '#'} className="flex items-center">
    <div className="flex flex-col">
      <span className="text-sm font-normal text-gray-800 hover:text-primary">
        {dataColumn ?? '-'}
      </span>
    </div>
  </Link>
)

export default NameActionCell
