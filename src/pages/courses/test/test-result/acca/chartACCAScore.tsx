import { calculatePercentage } from '@utils/helpers'
import { useDraggable } from 'react-use-draggable-scroll'
import { useScrollShadows } from 'src/hooks/useScrollShadows'
import { ChartDatum } from 'src/type'
interface IProps {
  data: ChartDatum[]
}

/**
 * ChartACCAScore Component
 *
 * Renders a horizontal bar chart displaying ACCA - Low F scores by part.
 *
 */
const ChartACCAScore = ({ data }: IProps) => {
  const { ref, showLeft, showRight } = useScrollShadows<HTMLDivElement>()
  const { events } = useDraggable(ref as React.MutableRefObject<HTMLElement>)
  return (
    <div className="relative block h-fit min-h-[152px] rounded-xl bg-white p-4 pb-0 text-gray-800 shadow-sidebar md:p-6">
      <div className="mb-6 text-lg font-semibold md:mb-8 ">
        Multiple Choice Score by Part
      </div>
      <div
        className="scrollbar flex w-full cursor-grab select-none gap-12 space-x-3 overflow-x-scroll pb-6"
        ref={ref}
        {...events}
      >
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
              <div className="line-clamp-2 text-sm font-medium md:text-base">
                {item?.title}
              </div>
              <div className="relative h-2 w-full rounded-full bg-progress-active">
                <div
                  className="absolute left-0 top-0 h-2 rounded-full bg-primary text-sm md:text-base"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
              <div>
                <span>{`${percentage}%`}</span>
                <span className="ml-2 inline-block text-sm text-gray-400">{`${item?.section_score}/${item?.max_section_score} correct answers`}</span>
              </div>
            </div>
          )
        })}
        {/* Left shadow */}
        <div
          className={`pointer-events-none absolute bottom-0 left-0 h-2/3 w-28 bg-gradient-to-r from-white to-white/0 transition-opacity duration-300 ${
            showLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right shadow */}
        <div
          className={`pointer-events-none absolute bottom-0 right-0 h-2/3 w-28 bg-gradient-to-l from-white to-white/0 transition-opacity duration-300 ${
            showRight ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  )
}

export default ChartACCAScore
