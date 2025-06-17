import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import { useRouter } from 'next/router'
import React from 'react'
import { ANIMATION, COURSE_TYPE } from 'src/constants'
import Layout from '@components/layout'
import CourseDashboard from '@components/dashboard/CourseDashboard'
import ExamDashboard from '@components/dashboard/dashboard-exam/ExamDashboard'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

const Dashboard = () => {
  const router = useRouter()
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)

  return (
    <Layout title="Dashboard" size='2xl'>
      <div
        className="3xl:px-13.75 lg:px-5"
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="main relative mx-auto my-0">
          <div className="flex w-full items-center justify-between pb-4 pt-6">
            <BreadcrumbFilter
              name={courseInfo?.name || ''}
              subpath="Dashboard"
              courseId={router.query.courseId}
            />
          </div>
        </div>
      </div>
      <div
        className="3xl:px-13.75 mx-auto flex min-h-[calc(100vh-5rem)] font-sans text-ink-700 lg:px-5"
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
