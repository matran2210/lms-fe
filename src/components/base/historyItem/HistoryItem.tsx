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
    <div className=" sapp-hover-device-item gap-4 px-6 py-5 hover:bg-secondary">
      <div className="flex items-center gap-2">
        <div className="text-base font-medium text-bw-1">{data.ip}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xsm text-gray-1">{formattedTime}</div>
        {data.location && (
          <div className="h-[0.25rem] w-[0.25rem] rounded-full bg-gray-1"></div>
        )}
        <div>{data.location || ''}</div>
      </div>
    </div>
  )
}
export default HistoryItem
