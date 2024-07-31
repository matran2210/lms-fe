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
    <div className="block bg-white xl:mb-6 mb-4 pr-5 pl-6 xl:pl-[99px] shadow-sidebar max-w-[1144px] h-[152px] dashboard-scroll-x dashboard-scroll-y">
      <div className="text-lg-xl xl:text-xl font-semibold xl:font-medium text-bw-1 pt-6 pb-4">
        Multiple Choice Score by Part
      </div>
      <div className="w-full dashboard-scroll-x dashboard-scroll-y pb-3">
        <div className="flex flex-row gap-14 flex-start">
          {data?.map((item: any) => (
            <div
              key={item?.id}
              className="flex flex-col w-1/3 max-w-78 justify-end shrink-0 items-start gap-1"
            >
              <div className="text-bw-1 font-normal line-clamp-2">
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
