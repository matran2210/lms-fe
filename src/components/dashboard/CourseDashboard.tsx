import OverProgress from '@components/dashboard/OverProgress'
import WeeklyReport from '@components/dashboard/WeeklyReport'
import TopicProgress from '@components/dashboard/TopicProgress'
import LearningResults from '@components/dashboard/LearningResults'
import OngoingActivities from '@components/dashboard/OngoingActivities'

const CourseDashboard = () => {
  return (
    <div className="mx-auto flex max-w-1729 grow flex-col gap-4 bg-[#F9F9F9] xl:flex-row 3xl:gap-6">
      <div className="flex flex-col gap-4 2xl:w-[65%] 3xl:gap-6">
        <div className="grid min-h-80 grid-cols-1 gap-2 lg:grid-cols-9 3xl:gap-6">
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
  )
}

export default CourseDashboard
