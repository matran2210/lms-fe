import { FC } from 'react'

type Props = {
  dataColumn?: string | number
}

const StudentCell: FC<Props> = ({ dataColumn }) => (
  <div className="flex items-center">
    <div className="flex flex-col">
      <span className="text-zinc-800">{dataColumn ?? '-'}</span>
    </div>
  </div>
)

export default StudentCell
