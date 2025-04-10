import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import { useRouter } from 'next/router'
import React from 'react'
import { ANIMATION } from 'src/constants'
import Layout from '@components/layout'
import OverProgress from '@components/dashboard/OverProgress'
import WeeklyReport from '@components/dashboard/WeeklyReport'
import TopicProgress from '@components/dashboard/TopicProgress'
import LearningResults from '@components/dashboard/LearningResults'
import OngoingActivities from '@components/dashboard/OngoingActivities'

const Dashboard = () => {
  const router = useRouter()

  return (
    <Layout title="Dashboard">
      <div className="lg:px-5 3.5xl:px-[55px]" data-aos={ANIMATION.DATA_AOS}>
        <div className="main relative mx-auto my-0">
          <div className="flex w-full items-center justify-between pb-4 pt-6">
            <BreadcrumbFilter
              name={localStorage.getItem('courseName') || ''}
              subpath="Dashboard"
              courseId={router.query.courseId}
            />
          </div>
        </div>
      </div>
      <div
        className="mx-auto flex min-h-[calc(100vh-5rem)] font-sans text-bw-12 lg:px-5 3.5xl:px-[55px]"
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="mx-auto flex max-w-[1729px] grow flex-col gap-4 bg-[#F9F9F9] xl:flex-row 3xl:gap-6">
          <div className="flex flex-col gap-4 2xl:max-w-[65%] 3xl:gap-6">
            <div className="grid min-h-[280px] grid-cols-1 gap-2 lg:grid-cols-9 3xl:gap-6">
              <OverProgress />
              <WeeklyReport />
            </div>
            <TopicProgress />
          </div>
          <div className="flex grow flex-col gap-4 3xl:gap-6">
            <LearningResults />
            <OngoingActivities />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
