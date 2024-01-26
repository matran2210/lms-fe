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
    <div className=" py-5 px-6 hover:bg-secondary sapp-hover-device-item gap-4">
      <div className="flex gap-2 items-center">
        <div className="text-bw-1 text-base font-medium">{data.ip}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xsm text-gray-1">{formattedTime}</div>
        <div className="bg-gray-1 rounded-full w-[4px] h-[4px]"></div>
        {data.location && (
          <div className="bg-gray-1 rounded-full w-[4px] h-[4px]"></div>
        )}
        <div>{data.location || ''}</div>
      </div>
    </div>
  )
}
export default HistoryItem
