import EntranceTestFilter from '@components/entrance-test/EntranceTestFilter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import React from 'react'
import EntranceTestList from '@components/entrance-test/EntranceTestList'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { ANIMATION } from 'src/constants'
import { useQuery } from 'react-query'
import { EntranceTestAPI } from '../api/entrance-test'
import { useRouter } from 'next/router'

const EntranceTest = () => {
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(getEntranceCount())
  // }, [])

  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await EntranceTestAPI.get(params);
      return data;
    };
  
    return useQuery([queryKey, params], fetchData);
  }

  const router = useRouter()
  const { data: entranceTestLists } = useGetData('data', {attempt_status: router?.query?.attempt_status})

  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-8 lg:mx-auto">
        <div className="flex justify-between pt-6 pb-4">
          <h2 className="text-medium-sm font-medium text-bw-1 ">
            Entrance Test
          </h2>
          <EntranceTestFilter count={entranceTestLists?.length || 0} />
        </div>
      </div>
      <div
        className="heading bg-white max-w-xxl my-0 flex mx-8 xl:mx-auto lg:mx-8 md:mx-8"
        data-aos={ANIMATION.DATA_AOS}
      >
        <Heading
          greeting="Welcome to"
          title="Entrance Test"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
      </div>
      <div
        className="pt-6 max-w-xxl my-0 mx-8 xl:mx-auto lg:mx-8"
        data-aos={ANIMATION.DATA_AOS}
      >
        <EntranceTestList entranceTestLists={entranceTestLists} />
      </div>
      <PopUpRemindEntrance />
    </>
  )
}

export default EntranceTest
// export async function getServerSideProps(context: any) {
//   const { req, res, query } = context

//   // Lấy accessToken từ cookie
//   const accessToken = req.cookies.accessToken

//   try {
//     // Parse cookies from the request headers
//     const cookies = parse(req.headers.cookie || '')
//     const queryString = buildQueryString({
//       attempt_status: query.attempt_status || '',
//     })
//     const entranceTestLists = (await EntranceApi.getListEntranceTest(
//       cookies.accessToken,
//       queryString,
//     )) as any

//     return {
//       props: { entranceTestLists },
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
//         const userInfo = refreshResponse?.data?.data?.tokens
//         const act = userInfo?.act
//         const rft = userInfo?.rft
//         // Save the new access token to the AsyncStorage
//         if (typeof window !== 'undefined') {
//           await AsyncStorage.setItem('accessToken', act)
//           await AsyncStorage.setItem('refreshToken', rft)
//         }
//         setCookieActToken(act)
//         setCookieRefreshToken(rft)
//         res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)

//         // Tiếp tục thực hiện yêu cầu API với accessToken mới
//         const queryString = buildQueryString({
//           attempt_status: query.attempt_status || '',
//         })
//         const entranceTestLists = (await EntranceApi.getListEntranceTest(
//           act,
//           queryString,
//         )) as any

//         return {
//           props: { entranceTestLists },
//         }
//       } catch (refreshError) {
//         // Xử lý lỗi khi cập nhật accessToken từ refreshToken
//         removeJwtToken()
//         // Chuyển hướng đến trang đăng nhập
//         return {
//           redirect: {
//             destination: '/',
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
//             destination: '/auth/login',
//             permanent: false,
//           },
//         }
//     }
//   }
// }
