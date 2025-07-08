import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import { useRouter } from 'next/router'
import React from 'react'
import { ANIMATION, COURSE_TYPE } from 'src/constants'
import Layout from '@components/layout'
import CourseDashboard from '@components/dashboard/CourseDashboard'
import ExamDashboard from '@components/dashboard/dashboard-exam/ExamDashboard'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/layout/Header/HeaderMobile'

const Dashboard = () => {
  const router = useRouter()
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  return (
    <Layout title="Dashboard" showSidebar={isAlwaysShowSidebar} size='xl'>
      <div className="lg:px-5 3xl:px-13.75" data-aos={ANIMATION.DATA_AOS}>
        <div className="main relative mx-auto my-0">
          <div className="hidden w-full items-center justify-between pb-4 pt-6 md:flex">
            <BreadcrumbFilter
              name={courseInfo?.name || ''}
              subpath="Dashboard"
              courseId={router.query.courseId}
            />
          </div>
          <div className="grid pb-4 pt-6 md:hidden">
            <HeaderMobile
              title="Student Dashboard"
              onBack={() => router.back()}
            />
          </div>
        </div>
      </div>
      <div
        className="text-ink-700 mx-auto flex min-h-[calc(100vh-5rem)] font-sans lg:px-5 3xl:px-13.75"
        data-aos={ANIMATION.DATA_AOS}
      >
        {courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE ? (
          <CourseDashboard />
        ) : (
          <ExamDashboard />
        )}
      </div>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(Dashboard)
