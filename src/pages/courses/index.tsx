import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import React from 'react'
import axios from 'axios'
import { apiURL } from 'src/redux/services/httpService'
import CoursesList from '@components/mycourses/CoursesList'

const MyCourse = ({ courses }: any) => {
  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full ml-12 flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between py-6">
          <h2 className="text-medium-sm font-semibold text-bw-1">My Course</h2>
          <Filter courses={courses} />
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading
          greeting="Welcome to"
          title="My Course"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <CoursesList courses={courses} />
      </div>
    </>
  )
}

export default MyCourse

export async function getServerSideProps(context: any) {
  const { req, res, query } = context
  const accessToken = req.cookies.accessToken

  try {
    const apiResponse = await axios.get(
      `${apiURL}/courses?page_index=1&page_size=100&name=${query.name ?? ''}&type=${query.type ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const courses = apiResponse.data?.data

    return {
      props: {
        courses,
      },
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
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

        res.setHeader(
          'Set-Cookie',
          `accessToken=${refreshResponse.data.accessToken}; HttpOnly`,
        )

        const newApiResponse = await axios.get(
          `${apiURL}/courses?page_index=1&page_size=10&name=${
            query.name ?? ''
          }&type=${query.type ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          },
        )

        return {
          props: {
            courses: newApiResponse.data?.data,
          },
        }
      } catch (refreshError) {}
    } else {
    }

    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
}
