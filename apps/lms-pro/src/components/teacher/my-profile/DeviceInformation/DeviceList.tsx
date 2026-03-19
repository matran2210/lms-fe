import { Icon } from '@lms/assets'
import { IDeviceItem, MY_COURSES } from '@lms/core'
import { SappDrawerV2 } from '@lms/ui'
import { useEffect, useMemo, useState } from 'react'
import UserApi from 'src/redux/services/User/user'
import DeviceItem from './DeviceItem'
import TeacherProfileCard from '@components/common/TeacherProfileCard'
import { calculateTimeAgo } from '@lms/utils'

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
    <TeacherProfileCard
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
        <div className="mt-6 flex items-start gap-2 md:mt-4">
          <div className="text-[#E68200]">
            <Icon type="shield-warning" />
          </div>
          <div className="text-sm text-gray-800">
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
      <SappDrawerV2
        open={selectedDrawer?.status || false}
        onClose={closeDeviceDrawer}
        title={`${selectedDrawer?.data.user_agent.browserName} ${selectedDrawer?.data.user_agent.browserVersion} (${selectedDrawer?.data.user_agent.osName})`}
        handleCancel={closeDeviceDrawer}
        // classNameHeader="bg-white !text-black"
        // classNameBody="h-[calc(100%-78px)] overflow-y-auto"
        // className="h-full"
        classNameHeader={
          'bg-white !text-gray-800 md:!p-0 lg:!px-8 lg:!py-6 !text-lg md:!text-2xl'
        }
        classNameBody="pt-0 md:pt-4 md:!px-0 md:!pb-0 lg:!px-8 lg:!pb-6 h-[calc(100%-80px)] overflow-y-auto"
        rootClassName={'profile-subject-drawer'}
        className="h-full"
        classNames={{
          content: 'rounded-2xl',
        }}
      >
        <div className="items flex h-full flex-col justify-between gap-8 text-sm md:text-base">
          <div className="flex flex-col gap-3 md:gap-4">
            {selectedDrawer?.data?.user_agent.browserName && (
              <div className="flex items-center justify-between text-gray-800">
                <span className="inline-block text-secondary md:w-[250px]">
                  Device Name:
                </span>
                <span className="font-semibold">
                  {`${selectedDrawer.data.user_agent.browserName} on ${selectedDrawer.data.user_agent.osName}`}
                </span>
              </div>
            )}
            {selectedDrawer?.data.user_agent.browserName && (
              <div className="flex items-center justify-between text-gray-800">
                <span className="inline-block text-secondary md:w-[250px]">
                  Browser:
                </span>
                <span className="font-semibold">
                  {selectedDrawer.data.user_agent.browserName || ''}
                </span>
              </div>
            )}
            {selectedDrawer?.data.user_agent.osName && (
              <div className="flex items-center justify-between text-gray-800">
                <span className="inline-block text-secondary md:w-[250px]">
                  OS:
                </span>
                <span className="font-semibold">
                  {selectedDrawer.data.user_agent.osName || ''}{' '}
                </span>
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center justify-between text-gray-800">
                <span className="inline-block md:w-[250px]"> Logged At: </span>
                <span className="font-semibold">{formattedDate || ''} </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg bg-error-50 px-4 py-3 text-error">
            <div className="font-medium">Remove Browser</div>
            <div className="cursor-pointer">
              <Icon type="delete" />
            </div>
          </div>
        </div>
      </SappDrawerV2>
    </TeacherProfileCard>
  )
}
export default DeviceList
