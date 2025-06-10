import Recommendation from '@components/test/Recommendation'
import { calculatePercentage } from '@utils/helpers'
import { ChartDatum, IQuizAttempComment } from 'src/type'

interface IProps {
  data: ChartDatum[]
  recommendation: IQuizAttempComment[]
}

/**
 * ChartACCAScore Component
 *
 * Renders a horizontal bar chart displaying ACCA - Low F scores by part.
 *
 */
const ChartACCAScore = ({ data, recommendation }: IProps) => {
  return (
    <div className="relative mb-4 block h-fit min-h-[152px] rounded-xl bg-white p-6 pb-0 text-ink-800 shadow-sidebar xl:mb-6">
      <div className="mb-8 text-lg font-semibold ">
        Multiple Choice Score by Part
      </div>
      <div className="flex-start scrollbar flex w-full snap-x flex-row gap-12 overflow-x-auto scroll-smooth pb-6">
        {data?.map((item: ChartDatum) => {
          const percentage = calculatePercentage(
            item?.section_score,
            item?.max_section_score,
          )
          return (
            <div
              key={item?.part_id}
              className="flex w-11/12 max-w-[444px] shrink-0 snap-start flex-col items-start justify-end gap-4 md:w-1/2 xl:w-1/3"
            >
              <div className="line-clamp-2 font-medium">{item?.title}</div>
              <div className="relative h-2 w-full rounded-full bg-progress-active">
                <div
                  className="absolute left-0 top-0 h-2 rounded-full bg-primary"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
              <div>
                <span>{`${percentage}%`}</span>
                <span className="ml-2 inline-block text-sm text-ink-400">{`${item?.section_score}/${item?.max_section_score} correct answers`}</span>
              </div>
            </div>
          )
        })}
        {/* <div
          className="absolute bottom-0 right-0 h-full w-48"
          style={{
            background:
              'linear-gradient(270deg, #FFF 38.41%, rgba(255, 255, 255, 0.00) 100%)',
          }}
        /> */}
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
