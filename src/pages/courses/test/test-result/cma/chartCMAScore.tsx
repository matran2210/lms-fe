import Recommendation from '@components/test/Recommendation'
import { formatNumber } from '@utils/formatNumber'
import { roundNumber } from '@utils/helpers'
import { Tooltip } from 'antd'
import _ from 'lodash'
import Image from 'next/image'
import { ChartDatum, IQuizAttempComment } from 'src/type'

interface IProps {
  data: ChartDatum[]
  GlobalAverage?: number
  score?: number
  isGraded?: boolean
  passingScore?: number
  recommendation?: IQuizAttempComment[]
}

const ChartCMAScore = ({
  data,
  GlobalAverage,
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
            <div className="text-black-1 text-xl font-medium">
              Multiple Choice Score
            </div>
            <div className="my-2 text-6xl font-bold text-primary">
              {score !== undefined ? formatNumber(score) : '--'}%
            </div>
          </div>
          <div className="text-black-1 mb-6 text-lg-xl font-semibold xl:text-xl xl:font-medium">
            Multiple Choice Score by Part
          </div>
        </div>
        <div className="content-center">
          <div className="flex flex-row">
            <div className="mr-2 pt-[2px]">
              <Image
                src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                width={16}
                height={16}
                alt="global"
              />
            </div>
            <div className="text-base font-normal text-gray-1">
              Global Average {GlobalAverage}%
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="group relative h-[250px]">
          <div className="h-full w-full border-b border-l border-gray-2 " />
          <div>
            {isGraded && (
              <div
                className={`absolute flex h-0 w-full items-center border-t border-dotted border-gray-2 group-hover:border-state-info`}
                style={{
                  bottom: passingScore + '%',
                }}
              >
                <div
                  className={`text-black-1 relative -left-6 text-medium-sm font-normal`}
                >
                  <span className="relative">{passingScore}</span>
                </div>
                <p className="sticky right-0 mb-7 ml-auto hidden text-sm text-state-info group-hover:block">
                  Passing Score
                </p>
              </div>
            )}
            {passingScore === 50 && isGraded ? (
              ''
            ) : (
              <div className="absolute bottom-1/2 flex h-0 w-full items-center border-t border-dotted border-gray-2">
                <div className="text-black-1 relative -left-6 bottom-[50%] text-medium-sm font-normal">
                  <span className="relative">50</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full flex-row">
            <div className="mr-5 mt-4 flex shrink-0 flex-col justify-between bg-white py-2">
              <div className="text-black-1 text-medium-sm">Part</div>
              <div className="text-black-1 text-medium-sm">Weight </div>
            </div>
            <div className="flex-start flex w-full flex-row">
              {data?.map((item) => (
                <div
                  key={item?.part_id}
                  className="relative flex w-28 shrink-0 flex-col items-center justify-between gap-1 px-3 py-2 first:ml-6 4xl:w-[150px]"
                >
                  <div className="absolute bottom-full left-1/2 h-[250px] w-14 -translate-x-1/2">
                    <Tooltip
                      color="white"
                      title={`${_.round((item?.total_correct_answers / item?.total_questions) * 100, 2)}%`}
                    >
                      <div
                        className="absolute bottom-0 w-14 border border-l-primary border-r-primary border-t-primary bg-secondary hover:bg-primary"
                        style={{
                          height: `${
                            (item?.total_correct_answers /
                              item?.total_questions) *
                            100
                          }%`,
                        }}
                      />
                    </Tooltip>
                    <div className="bg-black-1 absolute -bottom-2.5 left-1/2 h-2.5 w-[1px]" />
                  </div>
                  <div className="mt-4 line-clamp-2 w-full text-center text-medium-sm font-medium text-bw-1">
                    {item?.short_name}
                  </div>
                  <div className="text-black-1 w-full text-center text-medium-sm font-normal">
                    {`${roundNumber(
                      (item?.total_questions / item?.total_quiz_questions) *
                        100,
                    )}%`}
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
              <div className="w-full break-all py-2 text-medium-sm font-medium leading-4 text-bw-1">
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
