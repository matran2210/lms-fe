import Layout from '@components/layout'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { CoursesAPI } from 'src/pages/api/courses'
import ResultsTable from './ResultsTable'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { TEST_AND_QUIZ_TITLE } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const DEFAULT_PAGESIZE = 10

const Results = () => {
  const router = useRouter()
  const screens = useTailwindBreakpoint()
  const isAlwaysShowSidebar = ['lg', 'xl', '2xl', '3xl', '4xl'].includes(
    screens,
  )
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

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title={TEST_AND_QUIZ_TITLE} showSidebar={isAlwaysShowSidebar}>
        <div className="mx-auto my-0 max-[1199px]:mx-6">
          {isLoading ? (
            <CourseSkeleton className="pt-6" />
          ) : (
            <>
              <div className="mb-8 mt-6 flex w-full">
                {isSuccess && (
                  <SappBreadCrumbs
                    isTeacher={false}
                    breadcrumbs={[
                      {
                        title: 'My Course',
                        link: '/courses',
                      },
                      {
                        title: courseNameDetail,
                        link: `/courses/my-course/${router.query.courseId}`,
                      },
                      {
                        title: TEST_AND_QUIZ_TITLE,
                        link: '',
                      },
                    ]}
                  />
                )}
              </div>

              <h1 className="text-3xl font-semibold text-gray-800">
                {TEST_AND_QUIZ_TITLE}
              </h1>

              {isSuccess && <ResultsTable />}
            </>
          )}
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(Results)
