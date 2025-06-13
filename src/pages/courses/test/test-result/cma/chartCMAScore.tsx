import Recommendation from '@components/test/Recommendation'
import { calculatePercentage, roundNumber } from '@utils/helpers'

import Tooltip from 'src/common/Tooltip'
import { ChartDatum, IQuizAttempComment } from 'src/type'

interface IProps {
  data: ChartDatum[]
  globalAverage: number
  score?: number
  isGraded?: boolean
  passingScore?: number
  recommendation?: IQuizAttempComment[]
}

const ChartCMAScore = ({
  data,
  passingScore,
  isGraded,
  recommendation,
}: IProps) => {
  return (
    <div className="mb-4 min-h-[433px] w-full max-w-full items-start overflow-x-auto rounded-xl bg-white p-6 pl-12 text-gray-800 shadow-sidebar xl:mb-6">
      <div className="-ml-6 mb-11 text-lg font-semibold xl:font-medium">
        Multiple Choice Score by Part
      </div>
      <div className="">
        <div className="group relative h-[222px]">
          <div className="h-full w-full border-b border-l border-gray-300" />
          <div>
            {isGraded && (
              <div
                className={`absolute left-3 flex h-0 w-full items-center border-t border-dotted border-gray-300 group-hover:border-info`}
                style={{
                  bottom: passingScore + '%',
                }}
              >
                <div
                  className={`relative -left-6 text-sm font-normal text-black`}
                >
                  <span className="relative">{passingScore}</span>
                </div>
                <p className="sticky right-0 mb-7 ml-auto hidden text-sm text-info group-hover:block">
                  Passing Score
                </p>
              </div>
            )}
            {passingScore === 50 && isGraded ? (
              ''
            ) : (
              <div className="absolute bottom-1/2 left-3 flex h-0 w-[calc(100%-12px)] items-center border-t border-dotted border-gray-300">
                <div className="relative -left-9 bottom-[50%] text-sm font-normal">
                  <span className="relative">50</span>
                </div>
              </div>
            )}
          </div>
          <div className="-ml-6 flex w-full flex-row">
            <div className="flex flex-col justify-between bg-white pt-4">
              <div className="h-8 text-sm">Section</div>
              <div className="text-sm">Weight </div>
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
                  <div className="mb-3 mt-2 line-clamp-2 h-8 w-full text-center text-sm">
                    {item?.short_name ?? '-'}
                  </div>
                  <div className="w-full text-center text-sm font-normal">
                    {`${roundNumber(item?.max_section_score)}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {recommendation?.map((item, index) => (
        <Recommendation data={item} key={index} />
      ))}
    </div>
  )
}

export default ChartCMAScore
