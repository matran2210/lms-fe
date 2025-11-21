import { UserType } from '@lms/contexts'
import { ITabs, TitleSidebar } from '@lms/core'
import { CourseSkeleton, LayoutTeacher, SappLoadingGlobal } from '@lms/ui'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import { CoursesAPI } from 'src/pages/api/courses'

const DEFAULT_PAGESIZE = 10

const ResultsTeacher = () => {
  const router = useRouter()

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
      router.query.courseId,
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
      router.query.user_section_learning_status || undefined,
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
      link: `${PageLink.TEACHER_MY_COURSE}/my-course/${router.query.courseId}`,
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
        courseApi={CoursesAPI} authManager={new AuthenticationManager} pageLink={PageLink}
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
