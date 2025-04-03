import { formatDateFromUTC } from '@utils/index'
import { FC } from 'react'
import { DATE_FORMAT } from 'src/constants'

type Props = {
  dataColumn?: {
    firstLine: string
    secondLine?: string
  }
}
const RenderDateFormat = ({ date }: { date: string }) =>
  formatDateFromUTC(date, DATE_FORMAT.DATE_TIME)
const DateActionCell: FC<Props> = ({ dataColumn }) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-normal text-gray-400">
        <RenderDateFormat date={dataColumn?.firstLine as string} />
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
