import { SecurityIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import DeviceItem from '@components/base/deviceItem/DeviceItem'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MY_COURSES } from 'src/constants/lang'
import UserApi from 'src/redux/services/User/user'

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
    <div className="relative">
      <div className="sticky top-0 flex items-center justify-between border-b border-gray-3 bg-white">
        <div className="mx-6 pb-5 pt-6 text-xl font-medium">{`Browsers (${
          listDevices?.length || 0
        })`}</div>
        <SappButton
          onClick={onOpenTab}
          size="medium"
          title={'Back'}
          color="textUnderline"
          className="block pr-0 text-base lg:hidden"
        />
      </div>

      <div className="h-[calc(604px-70px)] overflow-y-auto">
        {listDevices?.map((e: any) => {
          return (
            <div key={e.id}>
              <DeviceItem data={e} />
            </div>
          )
        })}
        {listDevices?.map((e: any) => {
          return (
            <div key={e.id}>
              <DeviceItem data={e} />
            </div>
          )
        })}
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
      </div>
    </div>
  )
}
export default Devices
