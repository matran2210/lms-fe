import OverProgress from '@components/dashboard/dashboard-exam/OverProgress'
import TopicProgress from '@components/dashboard/dashboard-exam/TopicProgress'
import LearningResults from '@components/dashboard/dashboard-exam/LearningResults'

const ExamDashboard = () => {
  return (
    <div className="mx-auto max-w-[1954px] grow flex-col gap-4 bg-gray-canvas xl:flex-row 3xl:gap-6">
      <div className="flex w-full flex-col gap-4 3xl:gap-6">
        <LearningResults />
      </div>
      <div className="mb-10 mt-6 gap-6 xl:mt-8 xl:flex xl:justify-between xl:gap-8">
        <div className="w-full xl:w-8/12">
          <TopicProgress />
        </div>
        <OverProgress />
      </div>
    </div>
  )
}

export default ExamDashboard
