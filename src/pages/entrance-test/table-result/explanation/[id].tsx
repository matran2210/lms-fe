import { apiURL } from '@components/mycourses/LearningNotesList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeJwtToken } from '@utils/helpers/authen'
import { setCookieActToken, setCookieRefreshToken } from '@utils/index'
import axios from 'axios'
import { parse } from 'cookie'
import { useRouter } from 'next/router'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
// import {} from 'explanation-package'
const Explanation = ({ data }: any) => {
  const router = useRouter()
  //todo: call api, make UI
  // return <></>

  return <></>
}
export async function getServerSideProps(context: any) {
  const { req, res, query } = context

  // Lấy accessToken từ cookie
  const accessToken = req.cookies.accessToken

  // Kiểm tra accessToken
  if (!accessToken) {
    // Nếu không có accessToken, chuyển hướng đến trang đăng nhập
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  try {
    const { req } = context

    // Parse cookies from the request headers
    const cookies = parse(req.headers.cookie || '')

    if (!context?.query?.id) {
      return {
        notFound: true,
      }
    }

    const data = (await CourseTestApi.getAnswerData(
      context?.query?.id,
      cookies.accessToken,
    )) as any

    return {
      props: {
        data: data,
      },
    }
  } catch (error: any) {
    // Nếu có lỗi khi sử dụng accessToken, kiểm tra xem có phải là lỗi hết hạn không
    if (error.response && error.response.status === 401) {
      // Nếu là lỗi hết hạn, thực hiện cập nhật accessToken
      const refreshToken = req.cookies.refreshToken

      try {
        const refreshResponse = await axios.post(
          `${apiURL}/auth/rotate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )
        const userInfo = res?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        // Save the new access token to the AsyncStorage
        await AsyncStorage.setItem('accessToken', act)
        await AsyncStorage.setItem('refreshToken', rft)
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)
        const data = (await CourseTestApi.getAnswerData(
          context?.query?.id,
          act,
        )) as any

        return {
          props: {
            dara: data,
          },
        }
      } catch (refreshError) {
        // Xử lý lỗi khi cập nhật accessToken từ refreshToken
        // Chuyển hướng đến trang đăng nhập
        removeJwtToken()
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        }
      }
    } else {
      // Xử lý lỗi khác khi sử dụng accessToken
      if (error.response && error.response.status === 403) {
        // Chuyển hướng đến trang đăng nhập
        removeJwtToken()
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        }
      } else {
        return {
          redirect: {
            destination: '/404',
            permanent: false,
          },
        }
      }
    }
  }
}
export default Explanation
