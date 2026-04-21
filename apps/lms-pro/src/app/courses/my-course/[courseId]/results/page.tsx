'use client'
import { useFeature, UserType } from '@lms/contexts'
import { ApiError, DEFAULT_PAGE_SIZE, TEST_AND_QUIZ_TITLE } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  HeaderMobile,
  Layout,
  SappBreadCrumbs,
  TestQuizResultSkeleton,
} from '@lms/ui'
import clsx from 'clsx'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { FilterCourseIcon } from '@lms/assets'
import { PageLink } from 'src/constants/routers'
import { withAuthorization } from '@lms/hoc'
import ResultsTable from './ResultsTable'
import { CoursesAPI } from 'src/api/courses'
import { extractNotActivatedData } from '@lms/utils'
import {
  selectPopupActivateCourse,
  showPopupActivatedCourse,
} from '@lms/contexts/redux/slice/Popup/ActivatedCourse'

const Results = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const param = useParams()
  const { dispatch, useAppSelector } = useFeature()
  const selector = useAppSelector?.(selectPopupActivateCourse)
  const query = Object.fromEntries(searchParams.entries())
  const { isAlwaysShowSidebar, isTabletView, isMobileView } =
    useTailwindBreakpoint()
  const [openFilter, setOpenFilter] = useState(false)
  const handleBack = () => {
    if (param.courseId) router.push(`/courses/my-course/${param.courseId}`)
  }

  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async ({
    pageParam,
    params,
  }: {
    pageParam: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.getCourseDetail(
      param.courseId,
      pageParam || 1,
      DEFAULT_PAGE_SIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }

  const params = {
    user_section_learning_status:
      query.user_section_learning_status || undefined,
  }

  const { data: courseData } = useQuery({
    queryKey: ['courseDetail'],
    queryFn: ({ pageParam }) => fetchCourseDetail({ pageParam, params }),
    onError: (error: ApiError) => {
      const data = extractNotActivatedData(error)
      if (data) {
        dispatch?.(showPopupActivatedCourse(data))
      }
    },
    refetchOnWindowFocus: true,
    retry: false,
  })

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = courseData?.courseDetail?.data?.name

  return (
    <Layout title={TEST_AND_QUIZ_TITLE} showSidebar={isAlwaysShowSidebar}>
      {!courseData || selector?.openActive ? (
        <TestQuizResultSkeleton />
      ) : (
        <>
          {isAlwaysShowSidebar && (
            <div className="mb-2 mt-4 flex w-full">
              <SappBreadCrumbs
                isTeacher={false}
                breadcrumbs={[
                  { title: 'My Course', link: PageLink.COURSES },
                  {
                    title: courseNameDetail || '',
                    link: PageLink.COURSE_DETAIL.replace(
                      '[courseId]',
                      query.courseId as string,
                    ),
                  },
                  { title: TEST_AND_QUIZ_TITLE, link: '' },
                ]}
              />
            </div>
          )}

          <HeaderMobile
            title={TEST_AND_QUIZ_TITLE}
            showIcon={isTabletView || isMobileView}
            onBack={handleBack}
            className={clsx({
              'mt-4': isMobileView,
              'mt-8': isTabletView,
            })}
            extraActions={
              isMobileView && (
                <div onClick={() => setOpenFilter((prev) => !prev)}>
                  <FilterCourseIcon />
                </div>
              )
            }
          />

          <ResultsTable openFilter={openFilter} setOpenFilter={setOpenFilter} />
        </>
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(Results)
