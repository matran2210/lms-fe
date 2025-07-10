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
import { PageLink, TEST_AND_QUIZ_TITLE } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/layout/Header/HeaderMobile'

const DEFAULT_PAGESIZE = 10

const Results = () => {
  const router = useRouter()
  const { isAlwaysShowSidebar, isTabletView } = useTailwindBreakpoint()

  const handleBack = () => {
    if (router.query.courseId)
      router.push(`/courses/my-course/${router.query.courseId}`)
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
                        link: PageLink.COURSES,
                      },
                      {
                        title: courseNameDetail || '',
                        link: PageLink.COURSE_DETAIL.replace(
                          '[courseId]',
                          router.query.courseId as string,
                        ),
                      },
                      {
                        title: TEST_AND_QUIZ_TITLE,
                        link: '',
                      },
                    ]}
                  />
                )}
              </div>

              <HeaderMobile
                title={TEST_AND_QUIZ_TITLE}
                showIcon={isTabletView}
                onBack={handleBack}
              />

              {isSuccess && <ResultsTable />}
            </>
          )}
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(Results)
