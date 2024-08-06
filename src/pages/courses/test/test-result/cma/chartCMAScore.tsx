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
    <div className="mb-4 w-full max-w-full  items-start bg-white py-6 pl-6 shadow-sidebar xl:mb-6 xl:px-24">
      <div className="dashboard-scroll-x dashboard-scroll-y block">
        <div className="flex flex-row justify-between">
          <div>
            <div className="flex flex-col">
              <div className="text-xl font-medium text-black-1">
                Multiple Choice Score
              </div>
              <div className="my-2 text-6xl font-bold text-primary">
                {Math.floor(score as number)}%
              </div>
            </div>
            <div className="mb-6 text-lg-xl font-semibold text-black-1 xl:text-xl xl:font-medium">
              Multiple Choice Score by Part
            </div>
          </div>
          <div className="mr-[97px] content-center">
            <div className="flex flex-row">
              <div className="mr-1 pt-[2px]">
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
        <div
          className="relative left-5 mb-4 flex min-w-full"
          style={{
            width: `${data?.length > 0 && 17.5 * (data?.length + 1)}%`,
          }}
        >
          <div className="absolute top-1/2 h-full w-0.5 -translate-y-1/2 border-r border-gray-2"></div>
          <div className="h-[250px] w-full border-b border-gray-2">
            <div
              className="absolute flex h-[75%] min-w-full items-center border-t border-dotted border-gray-2 hover:border-state-info"
              style={{
                bottom: 0,
                height: `75%`,
              }}
            >
              <div className="relative bottom-[50%] left-[-20px] text-medium-sm font-normal text-black-1">
                <span className="relative">75</span>
              </div>
            </div>
            <div
              className="absolute flex h-[50%] min-w-full items-center border-t border-dotted border-gray-2 hover:border-state-info"
              style={{
                bottom: 0,
                height: `50%`,
              }}
            >
              <div className="relative bottom-[50%] left-[-20px] text-medium-sm font-normal text-black-1">
                <span className="relative">50</span>
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <div className="flex w-full flex-row">
            <div className="flex shrink-0 flex-col justify-between bg-white py-2 pr-7">
              <div className="text-medium-sm text-black-1">Part</div>
              <div className="text-medium-sm text-black-1">Weight</div>
            </div>
            <div className="flex-start flex flex-row pr-12">
              {data?.map((item: any, index: number) => (
                <div
                  key={item?.id + index}
                  className="relative flex w-full min-w-[134px] max-w-[134px] shrink-0 flex-col items-start justify-between gap-1 py-3 pr-6 first:ml-6"
                >
                  <div className="absolute bottom-[calc(100%+16px)] left-0 h-[250px] w-auto">
                    <div
                      className="absolute left-0 h-1 w-16 border border-l-primary border-r-primary border-t-primary bg-secondary"
                      style={{
                        bottom: `0%`,
                        height: `${
                          (item?.total_correct_answers /
                            item?.total_questions) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="line-clamp-2 w-full text-medium-sm font-medium text-bw-1">
                    {item?.short_name}
                  </div>
                  <div className="text-medium-sm font-normal text-black-1">
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
        <div className="mt-6 grid grid-cols-2 content-start gap-3">
          {data?.map((item: any, index: number) => (
            <div key={index} className="w-auto">
              <div className="w-full break-all py-2 text-medium-sm font-medium leading-4 text-bw-1">
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
