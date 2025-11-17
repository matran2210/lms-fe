import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ANIMATION, COURSE_TYPE, PageLink } from '@lms/core'
import Layout from '@components/layout'
import CourseDashboard from '@components/dashboard/CourseDashboard'
import ExamDashboard from '@components/dashboard/dashboard-exam/ExamDashboard'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import { ICourseInfo } from '@lms/core'
import ContinueLearning from '@components/dashboard/ContinueLearning'

const Dashboard = () => {
  const router = useRouter()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [infoCourse, setInfoCourse] = useState<ICourseInfo>({
    course_type: COURSE_TYPE.NORMAL_COURSE,
    course_name: '',
  })

  return (
    <Layout title="Dashboard" showSidebar={isAlwaysShowSidebar} size="xl">
      <div data-aos={ANIMATION.DATA_AOS}>
        <div className="main relative mx-auto my-0">
          <div className="mt-4 hidden w-full items-center justify-between xl:flex">
            <SappBreadCrumbs
              isTeacher={false}
              breadcrumbs={[
                {
                  title: 'My Course',
                  link: PageLink.COURSES,
                },
                {
                  title: infoCourse.course_name,
                  link: PageLink.COURSE_DETAIL.replace(
                    '[courseId]',
                    router.query.courseId as string,
                  ),
                },
                {
                  title: 'Student Dashboard',
                  link: '',
                },
              ]}
            />
          </div>
          <div className="mb-6 mt-2 grid md:mb-7 xl:mb-8">
            <HeaderMobile
              title="Student Dashboard"
              onBack={() => router.back()}
            />
          </div>
        </div>
      </div>
      <div
        className="text-ink-700 mx-auto mb-8 flex min-h-[calc(100vh-5rem)] font-sans"
        data-aos={ANIMATION.DATA_AOS}
      >
        {infoCourse?.course_type == COURSE_TYPE.NORMAL_COURSE
          ? infoCourse && <CourseDashboard setInfoCourse={setInfoCourse} />
          : infoCourse && <ExamDashboard setInfoCourse={setInfoCourse} />}
      </div>
      <ContinueLearning />
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(Dashboard)
