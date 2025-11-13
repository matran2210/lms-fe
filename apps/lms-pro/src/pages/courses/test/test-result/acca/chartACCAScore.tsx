import { calculatePercentage } from '@utils/helpers'
import Tooltip from 'src/common/Tooltip'
import { useDraggable } from 'react-use-draggable-scroll'
import { useScrollShadows } from 'src/hooks/useScrollShadows'
import { ChartDatum } from 'src/type'
interface IProps {
  data: ChartDatum[]
  loading?: boolean
}

/**
 * ChartACCAScore Component
 *
 * Renders a horizontal bar chart displaying ACCA - Low F scores by part.
 *
 */
const ChartACCAScore = ({ data, loading }: IProps) => {
  const { ref, showLeft, showRight } = useScrollShadows<HTMLDivElement>()
  const { events } = useDraggable(ref as React.MutableRefObject<HTMLElement>)
  return (
    <div className="relative block h-fit min-h-[152px] overflow-hidden rounded-xl bg-white p-4 pb-0 text-gray-800 shadow-small md:p-6">
      <div className="mb-6 text-lg font-semibold md:mb-8">
        Multiple Choice Score by Part
      </div>
      <div
        className="scrollbar flex w-full cursor-grab select-none gap-12 space-x-3 overflow-x-scroll pb-6"
        ref={ref}
        {...events}
      >
        {loading ? (
          <LoadingChartScore />
        ) : (
          <>
            {data?.map((item: ChartDatum) => {
              const percentage = calculatePercentage(
                item?.section_score,
                item?.max_section_score,
              )
              return (
                <div
                  key={item?.part_id}
                  className="flex w-11/12 max-w-[444px] shrink-0 snap-start flex-col justify-between gap-4 md:w-1/2 xl:w-1/3"
                >
                  <Tooltip title={item?.title}>
                    <div className="line-clamp-1 text-sm font-medium md:text-base">
                      {item?.title}
                    </div>
                  </Tooltip>
                  <div className="w-full">
                    <div className="relative h-2 w-full rounded-full bg-progress-active">
                      <div
                        className="absolute left-0 top-0 h-2 rounded-full bg-primary text-sm md:text-base"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <span>{`${percentage}%`}</span>
                      <span className="ml-2 inline-block text-sm text-gray-400">{`${item?.section_score}/${item?.max_section_score} correct answers`}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

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

const LoadingChartScore = () => {
  return Array(3)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="flex w-11/12 max-w-[444px] shrink-0 animate-pulse snap-start flex-col items-start justify-end gap-4 md:w-1/2 xl:w-1/3"
      >
        {/* Title skeleton */}
        <div className="h-6 w-3/4 rounded bg-skeleton"></div>

        {/* Progress bar skeleton */}
        <div className="relative h-2 w-full rounded-full bg-skeleton">
          <div
            className="absolute left-0 top-0 h-2 w-1/3 rounded-full bg-skeleton"
            style={{
              width: `${Math.random() * 80 + 10}%`,
            }}
          ></div>
        </div>

        {/* Percentage and answers skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-10 rounded bg-skeleton"></div>
          <div className="h-6 w-24 rounded bg-skeleton"></div>
        </div>
      </div>
    ))
}

export default ChartACCAScore
