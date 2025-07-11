import Layout from '@components/layout'
import { useRouter } from 'next/router'
import ResultsTable from './ResultsTable'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { PageLink, TEST_AND_QUIZ_TITLE } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import { useCourseContext } from '@contexts/index'

const Results = () => {
  const router = useRouter()
  const { isAlwaysShowSidebar, isTabletView, isMobileView } =
    useTailwindBreakpoint()
  const { courseName } = useCourseContext()

  const handleBack = () => {
    if (router.query.courseId)
      router.push(`/courses/my-course/${router.query.courseId}`)
  }

  const courseNameDetail = courseName

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
