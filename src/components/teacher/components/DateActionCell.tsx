import { formatDateFromUTC } from '@utils/index'
import { FC } from 'react'

type Props = {
  dataColumn?: {
    firstLine: string
    secondLine?: string
  }
}
const RenderDateFormat = ({ date }: { date: string }) =>
  formatDateFromUTC(date, 'HH:mm | DD/MM/YYYY')
const DateActionCell: FC<Props> = ({ dataColumn }) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-normal text-gray-400">
        {dataColumn?.firstLine ? (
          <RenderDateFormat date={dataColumn?.firstLine} />
        ) : (
          '-'
        )}
      </span>
      {dataColumn?.secondLine && (
        <span className="text-sm font-normal text-gray-400">
          <RenderDateFormat date={dataColumn?.secondLine} />
        </span>
      )}
    </div>
  )
}

export default DateActionCell
