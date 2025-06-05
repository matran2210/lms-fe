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
    <div className=" mb-4 block h-fit min-h-[152px] bg-white pb-3 pl-6 pr-5 shadow-sidebar xl:mb-6 xl:pl-[99px]">
      <div className="pb-4 pt-6 text-lg font-semibold text-[#050505] xl:text-xl xl:font-medium">
        Multiple Choice Score by Part
      </div>
      <div className="flex-start dashboard-scroll-x flex w-full snap-x flex-row gap-14 scroll-smooth">
        {data?.map((item: ChartDatum) => {
          const percentage = calculatePercentage(
            item?.section_score,
            item?.max_section_score,
          )
          return (
            <div
              key={item?.part_id}
              className="flex w-11/12 max-w-78 shrink-0 snap-start flex-col items-start justify-end gap-2 md:w-1/2 xl:w-1/3"
            >
              <div className="line-clamp-2 font-normal text-[#050505]">
                {item?.title}
              </div>
              <div className="relative h-2 w-full bg-[#F1F1F1]">
                <div
                  className="absolute left-0 top-0 h-2 bg-primary"
                  style={{
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
              <div className="flex w-full items-center justify-end text-base font-normal text-[#050505]">
                {`${percentage}%`}
              </div>
            </div>
          )
        })}
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
