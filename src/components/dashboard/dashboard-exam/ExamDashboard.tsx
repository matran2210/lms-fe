import OverProgress from '@components/dashboard/dashboard-exam/OverProgress'
import TopicProgress from '@components/dashboard/dashboard-exam/TopicProgress'
import LearningResults from '@components/dashboard/dashboard-exam/LearningResults'

const ExamDashboard = () => {
  return (
    <div className="mx-auto max-w-[1954px] grow flex-col gap-4 bg-[#F9F9F9] xl:flex-row 3xl:gap-6">
      <div className="flex w-full flex-col gap-4 3xl:gap-6">
        <LearningResults />
      </div>
      <div className="mb-10 xl:mt-8 mt-6 xl:gap-8 gap-6 xl:flex">
        <div className='xl:w-8/12 w-full'>
          <TopicProgress />
        </div>
        <OverProgress />
      </div>
    </div>
  )
}

export default ExamDashboard
