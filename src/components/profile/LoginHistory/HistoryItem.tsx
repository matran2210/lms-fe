import { format, formatDistanceToNow } from 'date-fns'
const HistoryItem = ({ data }: any) => {
  const loginTime = new Date(data.updated_at)
  const currentTime = new Date()

  const timeDifference = currentTime.getTime() - loginTime.getTime()

  let formattedTime

  if (timeDifference < 24 * 60 * 60 * 1000) {
    formattedTime = formatDistanceToNow(loginTime, { addSuffix: true })
  } else {
    formattedTime = format(loginTime, 'HH:mm:ss dd/MM/yyyy')
  }
  return (
    <div className=" sapp-hover-device-item mb-4 gap-4 hover:bg-secondary">
      <div className="flex items-center gap-2">
        <div className="text-base font-medium text-[#050505]">{data.ip}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xsm text-[#A1A1A1]">{formattedTime}</div>
        {data.location && (
          <div className="h-[4px] w-[4px] rounded-full bg-[#A1A1A1]"></div>
        )}
        <div>{data.location || ''}</div>
      </div>
    </div>
  )
}
export default HistoryItem
