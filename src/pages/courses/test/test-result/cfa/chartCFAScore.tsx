import { roundNumber } from '@utils/helpers'

interface DataItem {
  question_topic_id: string
  title: string
  total_correct_answers: number
  total_questions: number
  total_quiz_questions: number
}

interface IProps {
  data: DataItem[]
}
const ChartCFAScore = ({ data }: IProps) => {
  return (
    <div className="block overflow-x-auto">
      <div className="mb-6 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
        Multiple Choice Score by Topic
      </div>
      <div className="relative mb-4 flex w-full">
        <div className="absolute left-[-42px] top-[43%] shrink-0 -translate-y-1/2 -rotate-90 text-medium-sm font-normal text-bw-1">
          Available Points
        </div>
        <div className="absolute left-27 top-1/2 h-full w-0.5 -translate-y-1/2 border-r border-gray-1"></div>
        <div className="ml-9 h-40 w-full">
          <div
            className="mt-10 flex min-w-full items-center"
            style={{
              width: `${data?.length > 0 && 17.5 * (data?.length + 3)}%`,
            }}
          >
            <span className="pr-7 text-medium-sm font-normal text-bw-1">
              70%
            </span>
            <div className="w-full border-b border-gray-1"></div>
          </div>
          <div
            className="mt-4 flex min-w-full items-center"
            style={{
              width: `${data?.length > 0 && 17.5 * (data?.length + 3)}%`,
            }}
          >
            <span className="pr-7 text-medium-sm font-normal">50%</span>
            <div className="w-full border-b border-gray-1"></div>
          </div>
        </div>
      </div>
      <div className="block">
        <div className="flex w-full flex-row gap-10">
          <div className="flex shrink-0 flex-col justify-between bg-white py-2 pr-7">
            <div className="text-medium-sm">Topic</div>
            <div className="text-medium-sm">Weight</div>
          </div>
          <div className="flex-start flex flex-row pr-12">
            {data?.map((item: any, index: number) => (
              <div
                key={item?.id + index}
                className="relative flex w-full min-w-[134px] max-w-[134px] shrink-0 flex-col items-start justify-between gap-1 bg-gray-4 py-3 pl-6 pr-6"
              >
                <div className="absolute bottom-[calc(100%+16px)] left-0 h-40 w-auto">
                  <div
                    className="absolute left-6 h-1 w-16 bg-primary"
                    style={{
                      bottom: `${
                        (item?.total_correct_answers / item?.total_questions) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="line-clamp-2 w-full text-medium-sm font-medium text-bw-1">
                  {item?.title}
                </div>
                <div className="text-medium-sm font-normal text-gray-1">
                  {`${roundNumber(
                    (item?.total_questions / item?.total_quiz_questions) * 100,
                  )}%`}
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
