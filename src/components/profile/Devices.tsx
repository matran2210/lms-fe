import { SecurityIcon } from '@assets/icons'
import DeviceItem from '@components/base/deviceItem/DeviceItem'
import { useEffect, useState } from 'react'
import { MY_COURSES } from 'src/constants/lang'
import UserApi from 'src/redux/services/User/user'

const Devices = ({}: any) => {
  const [listDevices, setListDevices] = useState<any>()
  const getListDevices = async () => {
    const res = await UserApi.getListDevices()
    setListDevices(res)
  }
  useEffect(() => {
    getListDevices()
  }, [])
  return (
    <div className="bg-white py-6 flex-1 shadow-box">
      <div className="text-xl font-medium border-b pb-5 border-gray-3 mx-6">{`Browsers (${
        listDevices?.length || 0
      })`}</div>
      {listDevices?.map((e: any) => {
        return (
          <div key={e.id}>
            <DeviceItem data={e} />
          </div>
        )
      })}
      <div className="bg-gray-4 flex p-4 items-center gap-3 mx-6 mt-3">
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
