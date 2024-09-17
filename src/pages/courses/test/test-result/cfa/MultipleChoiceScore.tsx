import TotalScore from '@components/mycourses/test/TotalScore'
import { roundNumber } from '@utils/helpers'
import { QuizAttemptChart } from 'src/type'
import ChartCFAScore from './chartCFAScore'

interface IProps {
  chartData: QuizAttemptChart
}

const MultipleChoiceScore = ({ chartData }: IProps) => {
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)
  return (
    <div className="mb-4 w-full max-w-full items-start bg-white p-6 shadow-sidebar xl:mb-6 xl:px-24">
      <TotalScore
        score={chartData?.multiple_choice_score}
        globalAverage={GlobalAverage}
        classGlobal="mt-15 xl:pr-0"
      />
      <div className="block w-full">
        <ChartCFAScore data={chartData?.chart_data} />
      </div>
    </div>
  )
}

export default MultipleChoiceScore
