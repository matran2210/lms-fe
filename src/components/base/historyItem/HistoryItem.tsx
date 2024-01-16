import { format } from 'date-fns'
const HistoryItem = ({ data }: any) => {
  return (
    <div className=" py-5 px-6 hover:bg-secondary sapp-hover-device-item gap-4">
      <div className="flex gap-2 items-center">
        <div className="text-bw-1 text-base font-medium">{data.ip}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xsm text-gray-1">
          {format(data.created_at, 'HH:mm:ss dd/MM/yyyy')}
        </div>
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
