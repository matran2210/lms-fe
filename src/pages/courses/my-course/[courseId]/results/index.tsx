import Layout from '@components/layout'
import { useRouter } from 'next/router'
import ResultsTable from './ResultsTable'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { PageLink, TEST_AND_QUIZ_TITLE } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import { useQuery } from 'react-query'
import { CoursesAPI } from '@pages/api/courses'
import { DEFAULT_PAGE_SIZE } from 'src/constants'

const Results = () => {
  const router = useRouter()
  const { isAlwaysShowSidebar, isTabletView, isMobileView } =
    useTailwindBreakpoint()
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
      router.query.user_section_learning_status || undefined,
  }

  const { data: courseData } = useQuery({
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
    <Layout title={TEST_AND_QUIZ_TITLE} showSidebar={isAlwaysShowSidebar}>
      {!isMobileView && (
        <div className="mb-8 mt-6 flex w-full">
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
        </div>
      )}
      <HeaderMobile
        title={TEST_AND_QUIZ_TITLE}
        showIcon={isTabletView || isMobileView}
        onBack={handleBack}
        className={isMobileView ? 'mt-4' : ''}
      />

      <ResultsTable />
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(Results)
