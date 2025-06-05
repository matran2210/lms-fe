import OverProgress from '@components/dashboard/OverProgress'
import TopicProgress from '@components/dashboard/TopicProgress'
import LearningResults from '@components/dashboard/LearningResults'
import OngoingActivities from '@components/dashboard/OngoingActivities'

const ExamDashboard = () => {
  return (
    <div className="mx-auto flex max-w-1729 grow flex-col gap-4 bg-[#F9F9F9] xl:flex-row 3xl:gap-6">
      <div className="flex w-full flex-col gap-4 xl:w-[65%] 3xl:gap-6">
        <LearningResults />
        <OngoingActivities />
      </div>
      <div className="flex grow flex-col gap-4 3xl:gap-6">
        <OverProgress />
        <TopicProgress />
      </div>
    </div>
  )
}

export default ExamDashboard
