import TotalScore from '@components/mycourses/test/TotalScore'
import { roundNumber } from '@utils/helpers'
import { IQuizAttempComment, QuizAttemptChart } from 'src/type'
import ChartCFAScore from './chartCFAScore'
import Recommendation from '@components/test/Recommendation'

interface IProps {
  chartData: QuizAttemptChart
  recommendation: IQuizAttempComment[]
  isGraded?: boolean
  score?: number
}

const MultipleChoiceScore = ({
  chartData,
  recommendation,
  isGraded,
  score,
}: IProps) => {
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)
  return (
    <div className="mb-4 w-full max-w-full items-start bg-white p-6 shadow-sidebar xl:mb-6 xl:px-24">
      <TotalScore
        score={score}
        globalAverage={GlobalAverage}
        isGraded={isGraded}
      />
      <div className="block w-full">
        <ChartCFAScore data={chartData?.chart_data} />
      </div>
      {recommendation?.map((item, index) => (
        <Recommendation data={item} key={index} />
      ))}
    </div>
  )
}

export default MultipleChoiceScore
