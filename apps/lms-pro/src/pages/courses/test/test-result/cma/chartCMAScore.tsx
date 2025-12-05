import { calculatePercentage, roundNumber } from '@utils/helpers'
import { MutableRefObject, useRef } from 'react'
import { useDraggable } from 'react-use-draggable-scroll'

import { Tooltip } from "@lms/ui";
import { ChartDatum } from '@lms/core'

interface IProps {
  data: ChartDatum[]
  globalAverage: number
  score?: number
  isGraded?: boolean
  passingScore?: number
  loadingChart: boolean | undefined
}

const ChartCMAScore = ({
  data,
  passingScore,
  isGraded,
  loadingChart,
}: IProps) => {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const { events } = useDraggable(ref)
  return (
    <>
      {loadingChart ? (
        <LoadingChartScore ref={ref} events={events} />
      ) : (
        <div className="overflow-hidden rounded-xl">
          <div
            className="scrollbar min-h-[433px] w-full max-w-full select-none items-start overflow-x-auto rounded-xl bg-white p-4 !pl-12 text-gray-800 shadow-small md:p-6"
            ref={ref}
            {...events}
          >
            <div className="-ml-6 mb-11 text-xl font-semibold">
              Multiple Choice Score by Part
            </div>
            <div className="">
              <div className="group relative h-[222px]">
                <div
                  className="h-full border-b border-l border-gray-300"
                  style={{
                    width: data?.length * 150 + 'px',
                  }}
                />
                <div>
                  {isGraded && (
                    <div
                      className={`absolute left-3 z-10 flex h-0 items-center border-t border-dotted border-info`}
                      style={{
                        bottom: passingScore + '%',
                        width: data?.length * 150 - 12 + 'px',
                      }}
                    >
                      <div
                        className={`relative -left-10 text-xs font-normal text-black md:text-sm`}
                      >
                        <span className="relative">{passingScore}</span>
                      </div>
                      <p className="sticky right-0 mb-7 ml-auto text-xs text-info md:text-sm">
                        Passing Score
                      </p>
                    </div>
                  )}
                  {passingScore === 50 && isGraded ? (
                    ''
                  ) : (
                    <div
                      className="absolute bottom-1/2 left-3 z-10 flex h-0 items-center border-t border-dotted border-gray-300"
                      style={{
                        width: data?.length * 150 - 12 + 'px',
                      }}
                    >
                      <div className="relative -left-9 bottom-[50%] text-xs font-normal md:text-sm">
                        <span className="relative">50</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="-ml-6 flex w-full flex-row">
                  <div className="flex flex-col justify-between bg-white pt-4">
                    <div className="h-8 text-xs md:text-sm">Section</div>
                    <div className="text-xs md:text-sm">Weight </div>
                  </div>
                  <div className="flex w-full flex-row">
                    {data?.map((item) => (
                      <div
                        key={item?.part_id}
                        className="relative flex w-28 shrink-0 flex-col items-center justify-between gap-1 px-3 pt-2 4xl:w-[150px]"
                      >
                        <div className="absolute bottom-full left-1/2 h-[calc(222px-8px)] w-14 -translate-x-1/2">
                          <Tooltip title={`${item.title}`}>
                            <div
                              className="absolute bottom-2 w-[60px] rounded-lg border border-primary bg-primary-50"
                              style={{
                                height: `${calculatePercentage(
                                  item?.section_score,
                                  item?.max_section_score,
                                )}%`,
                              }}
                            />
                          </Tooltip>
                          <div className="absolute -bottom-2.5 left-1/2 h-2.5 w-[1px] bg-gray-800" />
                        </div>
                        <div className="mb-3 mt-2 line-clamp-2 h-8 w-full text-center text-xs md:text-sm">
                          {item?.short_name ?? '-'}
                        </div>
                        <div className="w-full text-center text-xs font-normal md:text-sm">
                          {`${roundNumber(item?.max_section_score)}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChartCMAScore

const LoadingChartScore = ({
  ref,
  events,
}: {
  ref: MutableRefObject<HTMLInputElement>
  events: {
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => void
  }
}) => {
  return (
    <div
      ref={ref}
      {...events}
      className="scrollbar min-h-[433px] w-full max-w-full select-none items-start overflow-x-auto rounded-xl bg-white p-4 !pl-12 text-gray-800 shadow-small md:p-6"
    >
      {/* Tiêu đề */}
      <div className="-ml-6 mb-11 text-xl font-semibold xl:font-medium">
        <div className="h-6 w-56 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Chart placeholder */}
      <div className="group relative h-[222px]">
        <div
          className="h-full border-b border-l border-gray-300"
          style={{
            width: 8 * 150 + 'px', // giả định có 8 cột
          }}
        />

        {/* passing score line */}
        <div
          className="absolute left-3 z-10 flex h-0 items-center border-t border-dotted border-gray-300"
          style={{
            bottom: '50%',
            width: 8 * 150 - 12 + 'px',
          }}
        >
          <div className="relative -left-9 bottom-[50%] h-3 w-5 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Phần bar skeleton */}
        <div className="-ml-6 flex w-full flex-row">
          <div className="flex flex-col justify-between bg-white pt-4">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="flex w-full flex-row">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="relative flex w-28 shrink-0 flex-col items-center justify-between gap-1 px-3 pt-2 4xl:w-[150px]"
                >
                  <div className="absolute bottom-full left-1/2 h-[calc(222px-8px)] w-14 -translate-x-1/2">
                    <div className="border-gray-200 absolute bottom-2 w-[60px] animate-pulse rounded-lg border bg-gray-100" />
                    <div className="absolute -bottom-2.5 left-1/2 h-2.5 w-[1px] bg-gray-300" />
                  </div>
                  <div className="mb-3 mt-2 h-8 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
