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
    <div className="dashboard-scroll-x dashboard-scroll-y mb-4 block h-[152px] max-w-[1144px] bg-white pl-6 pr-5 shadow-sidebar xl:mb-6 xl:pl-[99px]">
      <div className="pb-4 pt-6 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
        Multiple Choice Score by Part
      </div>
      <div className="dashboard-scroll-x dashboard-scroll-y w-full pb-3">
        <div className="flex-start flex flex-row gap-14">
          {data?.map((item: any) => (
            <div
              key={item?.id}
              className="flex w-1/3 max-w-78 shrink-0 flex-col items-start justify-end gap-1"
            >
              <div className="line-clamp-2 font-normal text-bw-1">
                {item?.title}
              </div>
              <div className="relative h-2 w-full bg-gray-3">
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
              <div className="flex w-full items-center justify-between text-base font-normal text-bw-1">
                {`${roundNumber(
                  (item?.total_correct_answers / item?.total_questions) * 100,
                )}%`}
                <div className="flex items-center pl-1 text-gray-1">
                  <img
                    src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                    alt="Correct"
                    className="mr-1.5 w-4 text-state-success"
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
