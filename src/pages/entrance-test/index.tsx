// import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import React from 'react'
import { parse } from 'cookie'
import EntranceTestList from '@components/entrance-test/EntranceTestList'
import EntranceApi from 'src/redux/services/EntranceTest'
import axios from 'axios'
import { apiURL } from '@components/mycourses/LearningResource'

// Config entrance test lists
const entranceTestLists = [
  {
    name: 'ACCA Entrance Test F1',
    startStatus: true,
    timeTaken: 2732,
    timeAllow: 555,
    result: '30/35',
  },
  {
    name: 'CFA Level 1 Entrance Test',
    startStatus: true,
    timeTaken: 2732,
    timeAllow: 555,
    result: '30/35',
  },
  {
    name: 'ACCA F1 Entrance Test kỳ 09/2023',
    startStatus: false,
    timeTaken: 2732,
    timeAllow: 10800,
    result: '30/35',
  },
  {
    name: 'ACCA Entrance Test 07/2023',
    startStatus: false,
    timeTaken: 2732,
    timeAllow: 2732,
    result: '30/35',
  },
  {
    name: 'ACCA F1 Entrance Test kỳ 09/2023',
    startStatus: false,
    timeTaken: 2732,
    timeAllow: 555,
    result: '30/35',
  },
  {
    name: 'CFA Level 2 Entrance Test',
    startStatus: true,
    timeTaken: 2732,
    timeAllow: 10800,
    result: '30/35',
  },
]

const EntranceTest = ({ entranceTestLists }: any) => {
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
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between py-6">
          <h2 className="text-medium-sm font-semibold text-bw-1">
            Entrance Test
          </h2>
          {/* <Filter /> */}
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading
          greeting="Welcome to"
          title="Entrance Test"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <EntranceTestList entranceTestLists={entranceTestLists} />
      </div>
    </>
  )
}

export default EntranceTest
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
    // Parse cookies from the request headers
    const cookies = parse(req.headers.cookie || '')

    const entranceTestLists = (await EntranceApi.getListEntranceTest(
      cookies.accessToken,
    )) as any

    return {
      props: { entranceTestLists },
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

        // Lưu accessToken mới vào cookie
        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        // Tiếp tục thực hiện yêu cầu API với accessToken mới
        const entranceTestLists = (await EntranceApi.getListEntranceTest(
          refreshResponse.data.accessToken,
        )) as any

        return {
          props: { entranceTestLists },
        }
      } catch (refreshError) {
        // Xử lý lỗi khi cập nhật accessToken từ refreshToken
        // Chuyển hướng đến trang đăng nhập
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
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        }
      } else
        return {
          redirect: {
            destination: '/test',
            permanent: false,
          },
        }
    }
  }
}
