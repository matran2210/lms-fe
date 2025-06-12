import OverProgress from '@components/dashboard/OverProgress'
import WeeklyReport from '@components/dashboard/WeeklyReport'
import TopicProgress from '@components/dashboard/TopicProgress'
import LearningResults from '@components/dashboard/LearningResults'
import OngoingActivities from '@components/dashboard/OngoingActivities'
import OverallProgress from './dashboard-normal/OverallProgress'

const CourseDashboard = () => {
  return (
    <div className="flex max-w-[1560px] flex-col gap-4 bg-[#F9F9F9]">
      <div className="grid xl:grid-cols-2 xl:gap-6">
        <div className="min-h-80">
          <OverallProgress />
        </div>
        <div className="min-h-80 rounded-2xl bg-white shadow-matchingquiz">
          b
        </div>
      </div>

      <div className="flex">
        <div className="w-[357px] rounded-2xl bg-white shadow-matchingquiz">
          sss
        </div>
        <div className="w-[357px] rounded-2xl bg-white shadow-matchingquiz">
          sss
        </div>
        <div className="w-[357px] rounded-2xl bg-white shadow-matchingquiz">
          sss
        </div>
        <div className="w-[357px] rounded-2xl bg-white shadow-matchingquiz">
          sss
        </div>
        <div className="w-[357px] rounded-2xl bg-white shadow-matchingquiz">
          sss
        </div>
      </div>

      <div className="grid xl:grid-cols-2  3xl:gap-6">
        <div>
          <TopicProgress />
        </div>
        <div className="flex rounded-2xl bg-white shadow-matchingquiz 3xl:px-8">
          {/* <LearningResults /> */}
          learning
        </div>
      </div>
      <div>aâ</div>
    </div>
  )
}

export default CourseDashboard
