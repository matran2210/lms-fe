import { roundNumber } from '@utils/helpers'
import Image from 'next/image'

interface DataItem {
  question_topic_id: string
  title: string
  total_correct_answers: number
  total_questions: number
  total_quiz_questions: number
}

interface IProps {
  data: DataItem[]
  GlobalAverage?: number
  score?: number
}

const ChartCMAScore = ({ data, GlobalAverage, score }: IProps) => {
  return (
    <div className="bg-white w-full max-w-full xl:max-w-[1144px] items-start pl-6 xl:px-24 py-6 xl:mb-6 mb-4 shadow-sidebar">
      <div className="block dashboard-scroll-x dashboard-scroll-y">
        <div className="flex flex-row justify-between">
          <div>
            <div className="flex flex-col">
              <div className="text-black-1 text-xl font-medium">
                Multiple Choice Score
              </div>
              <div className="text-primary text-6xl font-bold my-2">
                {Math.floor(score as number)}%
              </div>
            </div>
            <div className="text-lg-xl xl:text-xl font-semibold xl:font-medium text-black-1 mb-6">
              Multiple Choice Score by Part
            </div>
          </div>
          <div className="content-center mr-[97px]">
            <div className="flex flex-row">
              <div className="mr-1 pt-[2px]">
                <Image
                  src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                  width={16}
                  height={16}
                  alt="global"
                />
              </div>
              <div className="text-gray-1 text-base font-normal">
                Global Average {GlobalAverage}%
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex min-w-full relative mb-4 left-5"
          style={{
            width: `${data?.length > 0 && 17.5 * (data?.length + 1)}%`
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-full border-r border-gray-2"></div>
          <div className="h-[250px] w-full border-b border-gray-2">
            <div
              className="flex items-center min-w-full h-[75%] absolute border-t border-gray-2 border-dotted hover:border-state-info"
              style={{
                bottom: 0,
                height: `75%`
              }}
            >
              <div className="text-medium-sm text-black-1 font-normal relative bottom-[50%] left-[-20px]">
                <span className="relative">75</span>
              </div>
            </div>
            <div
              className="flex items-center min-w-full h-[50%] absolute border-t border-gray-2 border-dotted hover:border-state-info"
              style={{
                bottom: 0,
                height: `50%`
              }}
            >
              <div className="text-medium-sm text-black-1 font-normal relative bottom-[50%] left-[-20px]">
                <span className="relative">50</span>
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <div className="w-full flex flex-row">
            <div className="flex flex-col shrink-0 justify-between py-3 bg-white pr-7">
              <div className="text-medium-sm text-black-1">Part</div>
              <div className="text-medium-sm text-black-1">Weight</div>
            </div>
            <div className="flex flex-row flex-start pr-12">
              {data?.map((item: any, index: number) => (
                <div
                  key={item?.id + index}
                  className="flex relative flex-col w-full min-w-[134px] max-w-[134px] justify-between shrink-0 items-start gap-1 first:ml-6 pr-6 py-3"
                >
                  <div className="absolute left-0 bottom-[calc(100%+16px)] h-[250px] w-auto">
                    <div
                      className="w-16 h-1 bg-secondary border border-t-primary border-l-primary border-r-primary absolute left-0"
                      style={{
                        bottom: `0%`,
                        height: `${
                          (item?.total_correct_answers /
                            item?.total_questions) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>
                  <div className="text-medium-sm text-bw-1 font-medium w-full line-clamp-2">
                    {item?.short_name}
                  </div>
                  <div className="text-medium-sm text-black-1 font-normal">
                    {`${roundNumber(
                      (item?.total_questions / item?.total_quiz_questions) * 100
                    )}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start mt-6">
          {data?.map((item: any, index: number) => (
            <div key={index} className="w-auto">
              <div className="text-medium-sm text-bw-1 font-medium w-full break-all py-2 leading-4">
                {`${item?.short_name} - ${item?.title}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartCMAScore
