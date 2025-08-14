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
    <div className="sapp-hover-device-item gap-1 border-b border-gray-300 px-2 py-[6px] pb-2 hover:bg-gray-100 md:gap-4 md:border-none md:p-2">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-secondary md:text-base">
          {data.ip}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-secondary-100 md:text-sm">
        <div>{formattedTime}</div>
        {data.location && <div className="h-1 w-1 rounded-full"></div>}
        <div>{data.location || ''}</div>
      </div>
    </div>
  )
}
export default HistoryItem
