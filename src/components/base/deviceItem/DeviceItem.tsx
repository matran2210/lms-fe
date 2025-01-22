import { AppleLogo, PhoneLogo, WinDowLogo } from '@assets/icons'
import { useMemo } from 'react'
import { calculateTimeAgo } from '@utils/helpers'

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
    if (data?.created_at) {
      return calculateTimeAgo(data.created_at)
    }
    return null
  }, [data.created_at])
  return (
    <div className="sapp-hover-device-item flex items-center gap-4 px-6 py-5 hover:bg-secondary">
      <div className="sapp-logo box-border flex h-12 w-12 items-center justify-center border border-gray-1 bg-gray-4">
        {chooseLogo}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div className="text-base font-medium text-bw-1">
            {`${data.user_agent.browserName} ${data.user_agent.browserVersion} (${data.user_agent.osName})`}
          </div>
          {data.is_current && (
            <div className="h-fit bg-blue-50 px-2">
              <div className="text-xsm text-state-info">This Browser</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xsm text-gray-1">{formattedDate}</div>
          <div className="h-[0.25rem] w-[0.25rem] rounded-full bg-gray-1"></div>
          <div className="text-xsm text-gray-1">{data.ip}</div>
          {data.location && (
            <div className="h-[0.25rem] w-[0.25rem] rounded-full bg-gray-1"></div>
          )}
          <div>{data.location || ''}</div>
        </div>
      </div>
    </div>
  )
}
export default DeviceItem
