import OverProgress from '@components/dashboard/dashboard-exam/OverProgress'
import TopicProgress from '@components/dashboard/dashboard-exam/TopicProgress'
import LearningResults from '@components/dashboard/dashboard-exam/LearningResults'
import { IMockTestResult, ITopicProgress } from 'src/type/dashboard'

const ExamDashboard = ({
  topicProgressData,
  mockTestResultsData,
}: {
  topicProgressData: ITopicProgress[] | null
  mockTestResultsData: IMockTestResult | null
}) => {
  return (
    <div className="mx-auto w-full grow flex-col gap-4 bg-gray-canvas xl:flex-row 3xl:gap-6">
      <div className="flex w-full flex-col gap-4 3xl:gap-6">
        <LearningResults mockTestResultsData={mockTestResultsData} />
      </div>
      <div className="mb-10 mt-6 gap-6 xl:mt-8 xl:flex xl:justify-between xl:gap-8">
        <div className="w-full xl:w-8/12">
          <TopicProgress topicProgressData={topicProgressData} />
        </div>
        <OverProgress />
      </div>
    </div>
  )
}

export default ExamDashboard
