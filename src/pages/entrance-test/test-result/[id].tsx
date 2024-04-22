import { apiURL } from '@components/mycourses/LearningNotesList'
import {
  setCookieActToken,
  setCookieRefreshToken,
  removeJwtToken,
} from '@utils/index'
import axios from 'axios'
import { parse } from 'cookie'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import QuizResult from 'entrance-test-result-package'
import 'entrance-test-result-package/dist/index.css'
import { useRouter } from 'next/router'
import { LAYOUT } from '@utils/constants'
import { CloseIcon } from '@assets/icons'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { ANIMATION } from 'src/constants'
const TestEntranceResult = ({ chartData }: any) => {
  const router = useRouter()
  //todo: call api, make UI
  // return <></>

  return (
    <div className="bg-gray-4" data-aos={ANIMATION.DATA_AOS}>
      <div
        className="ml-auto cursor-pointer absolute  right-6 top-[18px]"
        onClick={() => {
          router.back()
        }}
      >
        <CloseIcon className="transition-all stroke-bw-1 ease-in-out duration-300 transform group-hover:stroke-primary" />
      </div>
      <QuizResult
        dataChart={chartData.chart_data}
        onClick={() => {
          router.push(`/entrance-test/table-result/${router.query.id}`)
        }}
        dataTable={chartData}
      />
    </div>
  )
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

    const chartData = (await CourseTestApi.getQuizAttemptsChartData(
      context?.query?.id,
      cookies.accessToken,
    )) as any

    return {
      props: {
        chartData: chartData,
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
        const userInfo = refreshResponse?.data?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; Path=/;`)

        // Xử lý dữ liệu từ API
        const chartData = (await CourseTestApi.getQuizAttemptsChartData(
          context?.query?.id,
          act,
        )) as any

        return {
          props: {
            chartData: chartData,
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
export default TestEntranceResult
TestEntranceResult.layout = LAYOUT.FULLSCREEN_LAYOUT
