import { SecurityIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import DeviceItem from '@components/base/deviceItem/DeviceItem'
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
    <div className="h-[calc(604px-70px)] h-full flex-1 overflow-y-auto bg-white py-6 lg:min-h-[400px]">
      <div className="mx-6 flex items-center justify-between border-b border-gray-3 pb-3">
        <div className="text-xl font-medium">{`Browsers (${
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

      {listDevices?.map((e: any) => {
        return (
          <div key={e.id}>
            <DeviceItem data={e} />
          </div>
        )
      })}
      <div className="mx-6 mt-3 flex items-center gap-3 bg-gray-4 p-4">
        <div>
          <SecurityIcon />
        </div>
        <div className="text-sm text-bw-1">
          <span>Maximum limit of 3 browsers: Please contact support team </span>
          <span>
            <a href="#" className="text-state-info underline">
              {MY_COURSES.hotline}
            </a>
          </span>
          <span> to remove one before accessing your account on another.</span>
        </div>
      </div>
    </div>
  )
}
export default Devices
