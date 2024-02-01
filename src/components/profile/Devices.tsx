import { SecurityIcon } from '@assets/icons'
import DeviceItem from '@components/base/deviceItem/DeviceItem'
import { apiURL } from '@components/mycourses/LearningResource'
import axios from 'axios'
import { parse } from 'cookie'
import { useEffect, useState } from 'react'
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
      <div className="text-xl font-bold border-b pb-5 border-gray-3 mx-6">{`Devices (${
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
          <span>Maximum limit of 3 devices: Please contact support team </span>
          <span>
            <a href="#" className="text-state-info underline">
              0889 662 276
            </a>
          </span>
          <span> to remove one before accessing your account on another.</span>
        </div>
      </div>
    </div>
  )
}
export default Devices

// export async function getServerSideProps(context: any) {
//   const { req, res } = context

//   const accessToken = req.cookies.accessToken
//   if (!accessToken) {
//     // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
//     return {
//       redirect: {
//         destination: '/auth/login',
//         permanent: false,
//       },
//     }
//   }
//   console.log(req);

//   try {
//     // Parse cookies from the request headers
//     const cookies = parse(req.headers.cookie || '')

//     const devices = (await UserApi.getListDevicesServerSide(
//       cookies.accessToken,
//     )) as any
//     console.log(devices);

//     return {
//       props: { devices },
//     }
//   } catch (error: any) {
//     // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
//     if (error.response && error.response.status === 401) {
//       // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
//       const refreshToken = req.cookies.refreshToken

//       try {
//         const refreshResponse = await axios.post(
//           `${apiURL}/auth/rotate`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${refreshToken}`,
//             },
//           },
//         )

//         // Lưu accessToken mới vào cookie
//         res.setHeader(
//           'Set-Cookie',
//           `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
//         )

//         // Tiếp tục thực hiện yêu cầu API với accessToken mới
//         const devices = (await UserApi.getListDevicesServerSide(
//           refreshResponse.data.accessToken,
//         )) as any
//         return {
//           props: { devices },
//         }
//       } catch (refreshError) {
//         // Xử lý lỗi khi cập nhật accessToken từ refreshToken
//         // Chuyển hướng đến trang đăng nhập
//         return {
//           redirect: {
//             destination: '/auth/login',
//             permanent: false,
//           },
//         }
//       }
//     } else {
//       // Xử lý lỗi khác khi sử dụng accessToken
//       if (error.response && error.response.status === 403) {
//         // Chuyển hướng đến trang đăng nhập
//         return {
//           redirect: {
//             destination: '/auth/login',
//             permanent: false,
//           },
//         }
//       } else
//         return {
//           redirect: {
//             destination: '/test',
//             permanent: false,
//           },
//         }
//     }
//   }
// }
