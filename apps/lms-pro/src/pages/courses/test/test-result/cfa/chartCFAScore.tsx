import { calculatePercentage, roundNumber } from '@utils/helpers'
import { useRef } from 'react'
import { useDraggable } from 'react-use-draggable-scroll'
import { ChartDatum } from '@lms/core'

interface IProps {
  data: ChartDatum[]
}

/**
 * ChartCFAScore Component
 *
 * Renders a chart displaying CFA (Chartered Financial Analyst) scores by topic.
 * The component shows a title "Multiple Choice Score by Topic", followed by a
 * visual representation of scores for each topic.
 *
 * Features:
 * - Y-axis labeled "Available Points" with 70% and 50% markers
 * - Horizontal bars for each topic showing the score percentage
 * - Topic titles and weights displayed below each bar
 *
 */
const ChartCFAScore = ({ data }: IProps) => {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const { events } = useDraggable(ref)
  return (
    <div
      className="scrollbar overflow-x-auto text-gray-800"
      {...events}
      ref={ref}
    >
      <div className="sticky left-0 mb-8 text-lg font-semibold md:text-xl">
        Multiple Choice Score by Topic
      </div>
      <div className="relative mb-4 flex w-full">
        <div className="absolute -left-9 top-[43%] shrink-0 -translate-y-1/2 -rotate-90 text-xs font-normal md:left-[-42px] md:text-sm">
          Available Points
        </div>
        <div className="absolute left-[108px] top-1/2 h-full w-0.5 -translate-y-1/2 border-r border-gray-300" />
        <div className="relative h-40 w-full pl-11">
          <div
            className="absolute top-[30%] flex w-full -translate-y-1/2 items-center"
            style={{
              // 54 = width of  the 50% blocks;
              // 14 = extra width extending from the vertical bar
              // 156 column size + gap
              // 24 padding left
              width: `${data?.length > 0 && 156 * data?.length + 54 + 14 + 24}px`,
            }}
          >
            <span className="pr-7 text-xs font-normal md:text-sm">70%</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>
          <div
            className="absolute top-1/2 flex w-full -translate-y-1/2 items-center"
            style={{
              // 54 = width of 50% blocks;
              // 14 = extra width extending from the vertical bar
              // 156 column size + gap
              // 24 padding left
              width: `${data?.length > 0 && 156 * data?.length + 54 + 14 + 24}px`,
            }}
          >
            <span className="pr-7 text-xs font-normal md:text-sm">50%</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>
        </div>
      </div>
      <div className="block">
        <div className="flex w-full flex-row">
          <div className="ml-11 flex shrink-0 flex-col justify-between bg-white py-4 pr-7 text-xs md:text-sm">
            <div>Topic</div>
            <div>Weight</div>
          </div>
          <div className="flex-start top- flex flex-row gap-6 rounded-xl bg-gray-100 px-6 py-4">
            {data?.map((item, index: number) => (
              <div
                key={item?.id + index}
                className="group relative flex w-[134px] shrink-0 cursor-pointer flex-col items-start justify-between gap-1"
              >
                <div className="absolute bottom-[calc(100%+2rem)] left-0 h-40 w-auto">
                  <div
                    className="absolute left-0 h-1 w-16 rounded-sm bg-primary"
                    style={{
                      bottom: `calc(${calculatePercentage(
                        item?.section_score,
                        item?.max_section_score,
                      )}% + 4px)`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-8 hidden w-[1px] rounded-none border-r border-dotted border-gray-300 group-hover:block"
                    style={{
                      height:
                        item?.section_score > 0
                          ? `calc(${calculatePercentage(
                              item?.section_score,
                              item?.max_section_score,
                            )}% + 4px)`
                          : 0,
                    }}
                  />
                </div>
                <div className="w-full text-xs font-medium md:text-sm">
                  {item?.title}
                </div>
                <div className="text-xs font-normal md:text-sm">
                  {`${roundNumber(item?.max_section_score)}%`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartCFAScore
