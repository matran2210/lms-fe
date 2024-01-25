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
      <div className="text-xl font-medium text-bw-1 mb-6">
        Your Performance by Topic Area
      </div>
      <div className="flex w-full relative mb-4">
        <div className="absolute top-[43%] -translate-y-1/2 left-[-42px] text-medium-sm text-bw-1 font-normal -rotate-90 shrink-0">
          Available Points
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-27 w-0.5 h-full border-r border-gray-1"></div>
        <div className="h-40 w-full ml-9">
          <div
            className="flex items-center min-w-full mt-10"
            style={{
              width: `${data.length > 0 && 14.5 * (data.length + 1)}%`,
            }}
          >
            <span className="text-medium-sm text-bw-1 font-normal pr-7">
              70%
            </span>
            <div className="w-full border-b border-gray-1"></div>
          </div>
          <div
            className="flex items-center min-w-full mt-4"
            style={{
              width: `${data.length > 0 && 14.5 * (data.length + 1)}%`,
            }}
          >
            <span className="text-medium-sm text-bw-1 font-normal pr-7">
              50%
            </span>
            <div className="w-full border-b border-gray-1"></div>
          </div>
        </div>
        {data.map((item, index) => (
          <div
            key={item?.question_topic_id}
            className="w-16 h-1 bg-primary absolute first:left-[14%]"
            style={{
              left: `${14.085 * (index + 1)}%`,
              bottom: `${
                (item?.total_correct_answers / item.total_questions) * 100
              }%`,
            }}
          ></div>
        ))}
      </div>
      <div className="block">
        <div className="bg-gray-4 w-full flex flex-row">
          <div className="flex flex-col shrink-0 justify-between py-3 bg-white pr-7">
            <div className="text-medium-sm text-bw-1">Topic Area</div>
            <div className="text-medium-sm text-bw-1">Topic Weight</div>
          </div>
          <div className="flex flex-row flex-start pr-6">
            {data?.map((item: any) => (
              <div
                key={item?.id}
                className="bg-gray-4 flex flex-col w-full min-w-[134px] max-w-[134px] justify-between shrink-0 items-start gap-1 first:ml-6 pr-6 py-3"
              >
                <div className="text-medium-sm text-bw-1 font-medium w-full line-clamp-2">
                  {item?.title}
                </div>
                <div className="text-medium-sm text-gray-1 font-normal">
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
