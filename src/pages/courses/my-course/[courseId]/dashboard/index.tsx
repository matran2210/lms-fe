import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ANIMATION, COURSE_TYPE, PageLink } from 'src/constants'
import Layout from '@components/layout'
import CourseDashboard from '@components/dashboard/CourseDashboard'
import ExamDashboard from '@components/dashboard/dashboard-exam/ExamDashboard'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import { ICourseInfo } from 'src/type/dashboard'
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
      <div className="lg:px-5 3xl:px-13.75" data-aos={ANIMATION.DATA_AOS}>
        <div className="main relative mx-auto my-0">
          <div className="hidden w-full items-center justify-between pb-4 pt-4 xl:flex">
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
          <div className="mb-6 mt-2 grid md:mb-7 md:mt-6 xl:mb-10 xl:mt-0">
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
        {infoCourse?.course_type == COURSE_TYPE.NORMAL_COURSE
          ? infoCourse && <CourseDashboard setInfoCourse={setInfoCourse} />
          : infoCourse && <ExamDashboard setInfoCourse={setInfoCourse} />}
      </div>
      <ContinueLearning />
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(Dashboard)
