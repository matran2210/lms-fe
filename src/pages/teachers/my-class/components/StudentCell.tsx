import { FC } from 'react'

type Props = {
  data?: string | number
}

const StudentCell: FC<Props> = ({ data }) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className="text-gray-800">{data ?? '-'}</span>
    </div>
  </div>
)

export default StudentCell
