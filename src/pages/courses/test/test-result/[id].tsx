import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadcrumb'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import React, { useEffect, useState } from 'react'
import { ITabs } from 'src/type'
import TestResultPage from './testResultPage'
import Breadcrumb from '@components/base/breadcrumb/SappBreadcrumb'
import axios from 'axios'
import { parse } from 'cookie'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { apiURL } from 'src/redux/services/httpService'
import { removeJwtToken } from '@utils/helpers/authen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setCookieActToken, setCookieRefreshToken } from '@utils/index'

// Config Courses
const breadcrumbs: ITabs[] = [
  {
    link: '/courses',
    title: 'Courses',
  },
  {
    link: '/courses',
    title: 'Final Test',
  },
  {
    link: '/',
    title: 'Results',
  },
]

const TestResultDetail = ({ questions, chartData }: any) => {
  return (
    <>
      <div className="main px-4 lg:px-16">
        <Breadcrumb tabs={breadcrumbs} currentPage={'Results'} />
      </div>
      <div className="px-4 lg:px-0 mx-auto lg:mx-16 mb-6">
        <TestResultPage
          questions={questions}
          type={questions?.course?.course_categories[0]?.name}
          chartData={chartData}
        />
      </div>
    </>
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
    const questions = (await CourseTestApi.getQuizAttempts(
      context?.query?.id,
      cookies.accessToken,
    )) as any

    const chartData = (await CourseTestApi.getQuizAttemptsChartData(
      context?.query?.id,
      cookies.accessToken,
    )) as any

    return {
      props: {
        questions: questions,
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
        const userInfo = res?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        // Save the new access token to the AsyncStorage
        await AsyncStorage.setItem('accessToken', act)
        await AsyncStorage.setItem('refreshToken', rft)
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)
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

export default TestResultDetail
