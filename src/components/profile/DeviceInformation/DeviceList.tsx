import { useEffect, useMemo, useState } from 'react'
import { MY_COURSES } from 'src/constants/lang'
import UserApi from 'src/redux/services/User/user'
import DeviceItem from './DeviceItem'
import ProfileCard from '@components/card/ProfileCard'
import Icon from '@components/icons'
import { IDeviceItem } from 'src/type/Profile'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import { calculateTimeAgo } from '@utils/helpers'

const DeviceList = () => {
  const [listDevices, setListDevices] = useState<IDeviceItem[]>()
  const [selectedDrawer, setSelectedDrawer] = useState<{
    status: boolean
    data: IDeviceItem
  }>()
  const closeDeviceDrawer = () => {
    setSelectedDrawer(undefined)
  }
  const formattedDate = useMemo(() => {
    if (selectedDrawer?.data?.created_at) {
      return calculateTimeAgo(selectedDrawer?.data.created_at)
    }
    return null
  }, [selectedDrawer?.data?.created_at])

  const getListDevices = async () => {
    const res = await UserApi.getListDevices()
    setListDevices(res)
  }
  useEffect(() => {
    getListDevices()
  }, [])
  return (
    <ProfileCard
      title={
        <div>
          Browsers{' '}
          <span className="text-base font-normal text-secondary-300">
            ({listDevices?.length || 0})
          </span>
        </div>
      }
      subtitle="These are browsers that you logged on"
    >
      <>
        {listDevices?.map((e: any, index: number) => {
          return (
            <div key={e.id}>
              <DeviceItem
                data={e}
                index={index}
                setSelectedDrawer={setSelectedDrawer}
              />
            </div>
          )
        })}
        <div className="mt-4 flex items-center gap-2">
          <div className="text-primary-4">
            <Icon type="shield-warning" />
          </div>
          <div className="text-sm text-[#050505]">
            <span>Maximum limit of 3 browsers: </span>
            <span className="font-semibold">
              Please contact support team {MY_COURSES.hotline}
            </span>
            <span>
              {' '}
              to remove one before accessing your account on another.
            </span>
          </div>
        </div>
      </>
      {selectedDrawer?.status && (
        <SappDrawerV2
          open={selectedDrawer?.status || false}
          onClose={closeDeviceDrawer}
          title={`${selectedDrawer.data.user_agent.browserName} ${selectedDrawer.data.user_agent.browserVersion} (${selectedDrawer.data.user_agent.osName})`}
          handleCancel={closeDeviceDrawer}
          classNameHeader="bg-white !text-black"
          classNameBody="h-[calc(100%-78px)] overflow-y-auto"
          className="h-full"
        >
          <div className="items flex h-full flex-col justify-between text-base">
            <div className="flex flex-col gap-4">
              {selectedDrawer.data?.user_agent.browserName && (
                <div className="flex items-center justify-between text-[#050505]">
                  <span className="inline-block w-[302px] text-secondary">
                    Device Name:
                  </span>
                  <span className="font-semibold">
                    {`${selectedDrawer.data.user_agent.browserName} on ${selectedDrawer.data.user_agent.osName}`}
                  </span>
                </div>
              )}
              {selectedDrawer.data.user_agent.browserName && (
                <div className="flex items-center justify-between text-[#050505]">
                  <span className="inline-block w-[302px] text-secondary">
                    Browser:
                  </span>
                  <span className="font-semibold">
                    {selectedDrawer.data.user_agent.browserName || ''}
                  </span>
                </div>
              )}
              {selectedDrawer.data.user_agent.osName && (
                <div className="flex items-center justify-between text-[#050505]">
                  <span className="inline-block w-[302px] text-secondary">
                    OS:
                  </span>
                  <span className="font-semibold">
                    {selectedDrawer.data.user_agent.osName || ''}{' '}
                  </span>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center justify-between text-[#050505]">
                  <span className="inline-block w-[302px] text-secondary">
                    {' '}
                    Logged At:{' '}
                  </span>
                  <span className="font-semibold">{formattedDate || ''} </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#FEEDED] px-4 py-3 text-[#F80903]">
              <div className="font-medium">Remove Browser</div>
              <div className="cursor-pointer">
                <Icon type="delete" />
              </div>
            </div>
          </div>
        </SappDrawerV2>
      )}
    </ProfileCard>
  )
}
export default DeviceList
