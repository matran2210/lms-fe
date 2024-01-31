import { AppleLogo, PhoneLogo, WinDowLogo } from '@assets/icons'
import { useMemo } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
const DeviceItem = ({ data }: any) => {
  const chooseLogo = useMemo(() => {
    if (data?.user_agent?.osName) {
      switch (data.user_agent.osName) {
        case 'Windows':
          return <WinDowLogo />
        case 'Mac OS':
          return <AppleLogo />
        default:
          return <PhoneLogo />
      }
    }
  }, [data?.user_agent?.osName])
  const formattedDate = useMemo(() => {
    if (data.created_at) {
      const loginTime = new Date(data.updated_at)
      const currentTime = new Date()

      const timeDifference = currentTime.getTime() - loginTime.getTime()

      let formattedTime

      if (timeDifference < 24 * 60 * 60 * 1000) {
        formattedTime = formatDistanceToNow(loginTime, { addSuffix: true })
      } else {
        formattedTime = format(loginTime, 'HH:mm:ss dd/MM/yyyy')
      }
    }
    return null
  }, [data.created_at])
  return (
    <div className="flex items-center py-5 px-6 hover:bg-secondary sapp-hover-device-item gap-4">
      <div className="border border-gray-1 flex sapp-logo bg-gray-4 box-border w-12 h-12 items-center justify-center">
        {chooseLogo}
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <div className="text-bw-1 text-base font-medium">
            {`${data.user_agent.browserName} ${data.user_agent.browserVersion} (${data.user_agent.osName})`}
          </div>
          {data.is_current && (
            <div className="bg-blue-50 h-fit px-2">
              <div className="text-state-info text-xsm">This Devices</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xsm text-gray-1">{formattedDate}</div>
          <div className="bg-gray-1 rounded-full w-[4px] h-[4px]"></div>
          <div className="text-xsm text-gray-1">{data.ip}</div>
          {data.location && (
            <div className="bg-gray-1 rounded-full w-[4px] h-[4px]"></div>
          )}
          <div>{data.location || ''}</div>
        </div>
      </div>
    </div>
  )
}
export default DeviceItem
