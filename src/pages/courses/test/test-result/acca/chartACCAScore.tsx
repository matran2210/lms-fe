import { roundNumber } from '@utils/helpers'

interface DataItem {
  question_topic_id: string
  title: string
  total_correct_answers: number
  total_questions: number
}

interface IProps {
  data: DataItem[]
}

const ChartACCAScore = ({ data }: IProps) => {
  return (
    <div className="block bg-white mb-6 py-6 pr-5 pl-6 xl:pl-24 shadow-sidebar max-w-[1144px]">
      <div className="text-xl font-medium text-bw-1 mb-5">
        Your Score by Topic
      </div>
      <div className="w-full overflow-x-auto">
        <div className="flex flex-row gap-14 flex-start">
          {data?.map((item: any) => (
            <div
              key={item?.id}
              className="flex flex-col w-1/3 max-w-78 justify-end shrink-0 items-start gap-1"
            >
              <div className="text-bw-1 font-medium line-clamp-2">
                {item?.title}
              </div>
              <div className="h-2 bg-gray-3 w-full relative">
                <div
                  className="absolute left-0 top-0 h-2 bg-primary"
                  style={{
                    width: `${roundNumber(
                      (item?.total_correct_answers / item?.total_questions) *
                        100,
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="text-base text-bw-1 font-normal flex items-center justify-between w-full">
                {`${roundNumber(
                  (item?.total_correct_answers / item?.total_questions) * 100,
                )}%`}
                <div className="flex items-center pl-1 text-gray-1">
                  <img
                    src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                    alt="Correct"
                    className="w-4 text-state-success mr-1.5"
                  />
                  <span>{roundNumber(item?.ratio ?? 0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartACCAScore
