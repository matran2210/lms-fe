import Filter from '@components/mycourses/Filter'
import FilterCourseDetail from '@components/mycourses/FilterCourseDetail'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeJwtToken } from '@utils/helpers/authen'
import {
  buildQueryString,
  setCookieActToken,
  setCookieRefreshToken,
} from '@utils/index'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import CourseAPI from 'src/pages/api/courses'
import { apiURL } from 'src/redux/services/httpService'
import { ICourseDetailAll, ICourseSection, IMeta } from 'src/type/courses'
import { ANIMATION, PageLink } from 'src/constants'
import AOS from 'aos'
import 'aos/dist/aos.css'

const DEFAULT_PAGESIZE = 18

const fetchData = async (
  id: string | string[] | undefined,
  pageSize: number,
  token: string,
  queryString?: string,
) => {
  const apiResponse = await axios.get(
    `${apiURL}/courses/${id}?page_index=1&page_size=${pageSize}${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return apiResponse?.data?.data
}

const CourseDetail = ({ courses }: { courses: ICourseDetailAll }) => {
  const [data, setData] = useState<ICourseSection[]>(
    courses?.data?.course_sections_with_progress || [],
  )
  const [metadata, setMetadata] = useState<IMeta>(courses?.metadata ?? {})
  const [class_user_id, setClassUserId] = useState(courses?.class_user_id)
  const [page, setPage] = useState(DEFAULT_PAGESIZE)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const queryString = buildQueryString({
    user_section_learning_status:
      router.query.user_section_learning_status || '',
  })

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newData = await CourseAPI.getCourseDetail(
        router.query.courseId,
        page + DEFAULT_PAGESIZE,
        queryString,
      )
      setData(newData?.data?.data?.course_sections_with_progress)
      setMetadata(newData?.data?.metadata)
      setPage(page + DEFAULT_PAGESIZE)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isFetching = false
    const isEndPage = page <= metadata?.total_records

    const handleScroll = () => {
      if (
        !isFetching &&
        isEndPage &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10
      ) {
        isFetching = true
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, router.query.user_section_learning_status])

  useEffect(() => {
    // Update data when courses?.data?.course_sections_with_progress changes
    setData(courses?.data?.course_sections_with_progress || [])
  }, [courses?.data?.course_sections_with_progress])

  return (
    <>
      <div className="header bg-white border-b border-default h-[70px]">
        <div className="max-w-xxl my-0 mx-auto flex py-6 xl-max:mx-5">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto xl-max:container relative">
        <div className="flex justify-between py-6 w-full items-center">
          <BreadcrumbFilter name={courses?.data?.name} />
          <FilterCourseDetail totalResult={data?.length} />
        </div>
      </div>
      <div
        className="heading bg-white max-w-xxl my-0 mx-auto flex xl-max:mx-6"
        data-aos={ANIMATION.DATA_AOS}
      >
        <Heading greeting="Welcome to" title={courses?.data?.name} />
      </div>
      <div
        className="pt-6 max-w-xxl my-0 mx-auto xl-max:container"
        data-aos={ANIMATION.DATA_AOS}
      >
        <CourseParts courses={data} class_user_id={class_user_id} />
      </div>
    </>
  )
}

export default CourseDetail

export async function getServerSideProps(context: any) {
  const { req, res, query } = context
  const accessToken = req.cookies.accessToken
  const queryString = buildQueryString({
    user_section_learning_status: query.user_section_learning_status || '',
  })

  try {
    const courses = await fetchData(
      query.courseId,
      DEFAULT_PAGESIZE,
      accessToken,
      queryString,
    )

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

        const userInfo = refreshResponse?.data?.data?.tokens
        const act = userInfo?.act
        const rft = userInfo?.rft
        // Save the new access token to the AsyncStorage
        if (typeof window !== 'undefined') {
          await AsyncStorage.setItem('accessToken', act)
          await AsyncStorage.setItem('refreshToken', rft)
        }
        setCookieActToken(act)
        setCookieRefreshToken(rft)
        res.setHeader('Set-Cookie', `accessToken=${act}; HttpOnly`)
        const courses = await fetchData(
          query.courseId,
          DEFAULT_PAGESIZE,
          act,
          queryString,
        )

        return {
          props: {
            courses: courses || {},
          },
        }
      } catch (refreshError) {
        removeJwtToken()
        return {
          redirect: {
            destination: PageLink.AUTH_LOGIN,
            permanent: false,
          },
        }
      }
    }
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
}
