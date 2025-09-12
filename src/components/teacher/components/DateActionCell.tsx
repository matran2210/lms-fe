import { formatDateFromUTC } from '@utils/index'
import { FC } from 'react'
import { DATE_FORMAT } from 'src/constants'

type Props = {
  dataColumn?: {
    startTime?: string
    endTime?: string
  }
}
const RenderDateFormat = ({ date }: { date: string }) =>
  formatDateFromUTC(date, DATE_FORMAT.DATE_TIME)
const DateActionCell: FC<Props> = ({ dataColumn }) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-normal text-[#a1a1aa]">
        <RenderDateFormat date={dataColumn?.startTime as string} />
      </span>
      {dataColumn?.endTime && (
        <span className="text-sm font-normal text-[#a1a1aa]">
          <RenderDateFormat date={dataColumn?.endTime} />
        </span>
      )}
    </div>
  )
}

export default DateActionCell
