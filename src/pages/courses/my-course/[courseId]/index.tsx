import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import axios from 'axios'
import React from 'react'
import { apiURL } from 'src/redux/services/httpService'
import { ICourseDetail } from 'src/type/courses'

const CourseDetail = ({ courses }: { courses: ICourseDetail }) => {
  return (
    <>
      <div className="header bg-white border-b border-default">
        <div className="max-w-xxl my-0 mx-auto flex py-[23px]">
          <SearchForm
            placeholder="Enter name of part..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between py-6">
          <BreadcrumbFilter name={courses?.name} />
          <Filter
            totalResult={courses?.course_sections_with_progress?.length}
          />
        </div>
      </div>
      <div className="heading bg-white max-w-xxl my-0 mx-auto flex">
        <Heading greeting="Welcome to" title={courses?.name} />
      </div>
      <div className="pt-6 max-w-xxl my-0 mx-auto">
        <CourseParts courses={courses?.course_sections_with_progress} />
      </div>
    </>
  )
}

export default CourseDetail

export async function getServerSideProps(context: any) {
  const { req, res, query } = context
  const accessToken = req.cookies.accessToken

  try {
    const apiResponse = await axios.get(`${apiURL}/courses/${query.courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const courses = apiResponse?.data?.data

    return {
      props: {
        courses: courses || {},
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
          `${apiURL}/courses/${query.courseId}`,
          {
            headers: {
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          },
        )

        return {
          props: {
            courses: newApiResponse?.data?.data || {},
          },
        }
      } catch (refreshError) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    } else {
    }
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
