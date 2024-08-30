import { SecurityIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import DeviceItem from '@components/base/deviceItem/DeviceItem'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MY_COURSES } from 'src/constants/lang'
import UserApi from 'src/redux/services/User/user'
import TabLayout from './TabLayout'

interface IProp {
  onOpenTab?: () => void
}

const Devices = ({ onOpenTab }: IProp) => {
  const [listDevices, setListDevices] = useState<any>()
  const getListDevices = async () => {
    const res = await UserApi.getListDevices()
    setListDevices(res)
  }
  useEffect(() => {
    getListDevices()
  }, [])
  return (
    <TabLayout
      title={`Browsers (${listDevices?.length || 0})`}
      headerButtons={
        <SappButton
          onClick={onOpenTab}
          size="medium"
          title={'Back'}
          color="textUnderline"
          className="block pr-0 text-base lg:hidden"
        />
      }
    >
      <>
        {listDevices?.map((e: any) => {
          return (
            <div key={e.id}>
              <DeviceItem data={e} />
            </div>
          )
        })}
        <div className="mx-6 mb-6 mt-3 flex items-center gap-3 bg-gray-4 p-4">
          <div>
            <SecurityIcon />
          </div>
          <div className="text-sm text-bw-1">
            <span>
              Maximum limit of 3 browsers: Please contact support team{' '}
            </span>
            <span>
              <a href="#" className="text-state-info underline">
                {MY_COURSES.hotline}
              </a>
            </span>
            <span>
              {' '}
              to remove one before accessing your account on another.
            </span>
          </div>
        </div>
      </>
    </TabLayout>
  )
}
export default Devices
