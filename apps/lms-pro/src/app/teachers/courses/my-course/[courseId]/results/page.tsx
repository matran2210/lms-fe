"use client"
import { UserType } from '@lms/contexts'
import { ITabs, TitleSidebar } from '@lms/core'
import { CourseSkeleton, LayoutTeacher, SappLoadingGlobal } from '@lms/ui'
import { useParams, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { CoursesAPI } from 'src/api/courses'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'

const DEFAULT_PAGESIZE = 10

const ResultsTeacher = () => {
  const searchParam = useSearchParams()
  const param = useParams();
  const { courseId } = param
  const query = Object.fromEntries(searchParam.entries())

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
      courseId,
      pageParam || 1,
      DEFAULT_PAGESIZE,
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

  const {
    data: courseData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['courseDetail'],
    queryFn: ({ pageParam }) => fetchCourseDetail({ pageParam, params }),
    refetchOnWindowFocus: true,
    retry: false,
  })

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = courseData?.courseDetail?.data?.name

  const breadcrumbs: ITabs[] = [
    { link: PageLink.TEACHER_MY_COURSE, title: 'My Course' },
    {
      link: `${PageLink.TEACHER_MY_COURSE}/my-course/${courseId}`,
      title: courseNameDetail || '',
    },
    {
      link: '#',
      title: TitleSidebar.RESULTS,
    },
  ]

  return (
    <SappLoadingGlobal loading={isLoading}>
      <LayoutTeacher
        title="Course Results"
        breadcrumbs={breadcrumbs}
        isCourseDetail
      >
        <div className="my-0">
          {isLoading ? (
            <CourseSkeleton className="pt-6" />
          ) : (
            <>
              <div className="bg-white xl-max:container">
                {/* {isSuccess && <ResultsTable isTeacher />} */}
              </div>
            </>
          )}
        </div>
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.TEACHER])(ResultsTeacher)
