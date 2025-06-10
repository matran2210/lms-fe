import Recommendation from '@components/test/Recommendation'
import { formatNumber } from '@utils/formatNumber'
import { calculatePercentage, roundNumber } from '@utils/helpers'

import { isNull, isUndefined } from 'lodash'
import Image from 'next/image'
import Tooltip from 'src/common/Tooltip'
import { ChartDatum, IQuizAttempComment } from 'src/type'
import GlobalAverage from '../GlobalAverage'

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
  globalAverage,
  score,
  passingScore,
  isGraded,
  recommendation,
}: IProps) => {
  return (
    <div className="mb-4 w-full max-w-full items-start overflow-x-auto bg-white px-5 py-4 shadow-sidebar md:px-11 md:py-6 xl:mb-6 xl:px-24">
      <div className="sticky left-0 flex flex-row justify-between">
        <div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-black">
              {isGraded ? 'Overall Score' : 'Multiple Choice Score'}
            </div>
            <div className="my-2 text-7xl font-bold text-primary">
              {isNull(score) || isUndefined(score) ? '--' : formatNumber(score)}
              %
            </div>
          </div>
          <div className="mb-6 text-lg font-semibold text-black xl:text-xl xl:font-medium">
            Multiple Choice Score by Part
          </div>
        </div>
        <div className="content-center">
          <GlobalAverage globalAverage={globalAverage} />
        </div>
      </div>
      <div className="">
        <div className="group relative h-[250px]">
          <div className="h-full w-full border-b border-l border-[#DCDDDD] " />
          <div>
            {isGraded && (
              <div
                className={`absolute flex h-0 w-full items-center border-t border-dotted border-[#DCDDDD] group-hover:border-[#3964EA]`}
                style={{
                  bottom: passingScore + '%',
                }}
              >
                <div
                  className={`relative -left-6 text-sm font-normal text-black`}
                >
                  <span className="relative">{passingScore}</span>
                </div>
                <p className="sticky right-0 mb-7 ml-auto hidden text-sm text-[#3964EA] group-hover:block">
                  Passing Score
                </p>
              </div>
            )}
            {passingScore === 50 && isGraded ? (
              ''
            ) : (
              <div className="absolute bottom-1/2 flex h-0 w-full items-center border-t border-dotted border-[#DCDDDD]">
                <div className="relative -left-6 bottom-[50%] text-sm font-normal text-black">
                  <span className="relative">50</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full flex-row">
            <div className="mr-5 mt-4 flex shrink-0 flex-col justify-between bg-white py-2">
              <div className="text-sm text-black">Part</div>
              <div className="text-sm text-black">Weight </div>
            </div>
            <div className="flex-start flex w-full flex-row">
              {data?.map((item) => (
                <div
                  key={item?.part_id}
                  className="relative flex w-28 shrink-0 flex-col items-center justify-between gap-1 px-3 py-2 first:ml-6 4xl:w-[150px]"
                >
                  <div className="absolute bottom-full left-1/2 h-[250px] w-14 -translate-x-1/2">
                    <Tooltip
                      title={`${calculatePercentage(
                        item?.section_score,
                        item?.max_section_score,
                      )}%`}
                    >
                      <div
                        className="absolute bottom-0 w-14 border border-l-primary border-r-primary border-t-primary bg-secondary "
                        style={{
                          height: `${calculatePercentage(
                            item?.section_score,
                            item?.max_section_score,
                          )}%`,
                        }}
                      />
                    </Tooltip>
                    <div className="absolute -bottom-2.5 left-1/2 h-2.5 w-[1px] bg-black" />
                  </div>
                  <div className="mt-4 line-clamp-2 w-full text-center text-sm font-medium text-[#050505]">
                    {item?.short_name}
                  </div>
                  <div className="w-full text-center text-sm font-normal text-black">
                    {`${roundNumber(item?.max_section_score)}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky left-0 mt-28 grid grid-cols-2 content-start gap-3 2xl:grid-cols-3">
        {data?.map((item) => {
          return (
            <div key={item.part_id} className="w-auto">
              <div className="w-full break-all py-2 text-sm font-medium leading-4 text-[#050505]">
                {`${item?.short_name ? item?.short_name + ' -' : ''} ${item?.title}`}
              </div>
            </div>
          )
        })}
      </div>
      {recommendation?.map((item, index) => (
        <Recommendation data={item} key={index} />
      ))}
    </div>
  )
}

export default ChartCMAScore
