import Recommendation from '@components/test/Recommendation'
import { calculatePercentage } from '@utils/helpers'
import { formatNumber } from '@utils/formatNumber'
import { isNull, isUndefined } from 'lodash'
import { ChartDatum, IQuizAttempComment } from 'src/type'

interface IProps {
  data: ChartDatum[]
  recommendation: IQuizAttempComment[]
  isGraded: boolean
  gradedScore?: number
}

/**
 * ChartACCAScore Component
 *
 * Renders a horizontal bar chart displaying ACCA - Low F scores by part.
 *
 */
const ChartACCAScore = ({
  data,
  recommendation,
  isGraded,
  gradedScore,
}: IProps) => {
  return (
    <div className=" mb-4 block h-fit bg-white pb-3 pl-6 pr-5 shadow-sidebar xl:mb-6 xl:pl-[99px]">
      {isGraded && (
        <div className="flex flex-col">
          <div className="text-black-1 text-xl font-medium">Overall Score</div>
          <div className="my-2 text-6xl font-bold text-primary">
            {isGraded && !isNull(gradedScore) && !isUndefined(gradedScore)
              ? formatNumber(Number(gradedScore))
              : '--'}
            %
          </div>
        </div>
      )}
      <div className="pb-4 pt-6 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
        Multiple Choice Score by Part
      </div>
      <div className="flex-start dashboard-scroll-x flex w-full snap-x flex-row gap-14 scroll-smooth">
        {data?.map((item: ChartDatum) => (
          <div
            key={item?.part_id}
            className="flex w-11/12 max-w-78 shrink-0 snap-start flex-col items-start justify-end gap-2 md:w-1/2 xl:w-1/3"
          >
            <div className="line-clamp-2 font-normal text-bw-1">
              {item?.title}
            </div>
            <div className="relative h-2 w-full bg-gray-3">
              <div
                className="absolute left-0 top-0 h-2 bg-primary"
                style={{
                  width: `${calculatePercentage(
                    item?.total_correct_answers,
                    item?.total_questions,
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex w-full items-center justify-end text-base font-normal text-bw-1">
              {`${calculatePercentage(
                item?.total_correct_answers,
                item?.total_questions,
              )}%`}
            </div>
          </div>
        ))}
      </div>
      <div>
        {recommendation?.map((item, index) => (
          <Recommendation data={item} key={index} />
        ))}
      </div>
    </div>
  )
}

export default ChartACCAScore
