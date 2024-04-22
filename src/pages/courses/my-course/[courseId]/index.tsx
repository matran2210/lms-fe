import FilterCourseDetail from '@components/mycourses/FilterCourseDetail'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import { ICourseSection, IMeta } from 'src/type/courses'
import { ANIMATION } from 'src/constants'
import { useQuery } from 'react-query'

const DEFAULT_PAGESIZE = 18

const CourseDetail = () => {
  const router = useRouter()

  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await CoursesAPI.getCourseDetail(
        router.query.courseId,
        1,
        DEFAULT_PAGESIZE,
        params,
      )
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: router.query.courseId !== undefined,
    })
  }

  const params = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

  const { data: courses } = useGetData('courses-detail', params)

  const [data, setData] = useState<ICourseSection[]>(
    courses?.data?.course_sections_with_progress || [],
  )
  const [metadata, setMetadata] = useState<IMeta>(courses?.metadata ?? {})
  const [class_user_id, setClassUserId] = useState(courses?.class_user_id)
  const [page, setPage] = useState(DEFAULT_PAGESIZE)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newData = await CoursesAPI.getCourseDetail(
        router.query.courseId,
        1,
        page + DEFAULT_PAGESIZE,
        params,
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
        <div className="flex justify-between pt-6 pb-4 w-full items-center">
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
