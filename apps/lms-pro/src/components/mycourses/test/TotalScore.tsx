import GlobalAverage from '@pages/courses/test/test-result/GlobalAverage'
import { formatNumber } from '@lms/utils'
import { isNull, isUndefined } from 'lodash'
interface IProps {
  score?: number
  className?: string
  classScore?: string
  classCountAll?: string
  globalAverage: number
  isGraded?: boolean
}

const TotalScore = ({
  score,
  className = '',
  classScore = '',
  globalAverage,
  isGraded,
}: IProps) => {
  return (
    <div
      className={`${className} flex w-full flex-row flex-wrap justify-between bg-white xl:mb-6 2xl:mb-8`}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="block">
          <div className="mb-3 text-2xl font-semibold text-gray-800 xl:font-bold">
            {isGraded ? 'Overall Score' : 'Multiple Choice Score'}
          </div>
          <div
            className={`${classScore} font-inter text-6xl font-bold text-primary xl:text-6xl`}
          >
            {!isNull(score) && !isUndefined(score) ? formatNumber(score) : '--'}
            %
          </div>
        </div>
        <GlobalAverage
          globalAverage={globalAverage}
          className="mt-15 xl:pr-0"
        />
      </div>
    </div>
  )
}

export default TotalScore
