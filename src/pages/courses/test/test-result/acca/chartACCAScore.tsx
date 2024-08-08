import { calculatePercentage, roundNumber } from '@utils/helpers'

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
    <div className=" mb-4 block h-[152px] bg-white pb-3 pl-6 pr-5 shadow-sidebar xl:mb-6 xl:pl-[99px]">
      <div className="pb-4 pt-6 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
        Multiple Choice Score by Part
      </div>
      <div className="flex-start dashboard-scroll-x flex w-full snap-x flex-row gap-14">
        {data?.map((item: any) => (
          <div
            key={item?.id}
            className="flex w-11/12 max-w-78 shrink-0 snap-start flex-col items-start justify-end gap-2 md:w-1/2 xl:w-1/3"
          >
            <div className="line-clamp-2 font-normal text-bw-1">
              {item?.title}
            </div>
            <div className="relative h-2 w-full bg-gray-3">
              <div
                className="absolute left-0 top-0 h-2 bg-primary"
                style={{
                  width: `${calculatePercentage(
                    item?.total_correct_answers,
                    item?.total_questions,
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex w-full items-center justify-end text-base font-normal text-bw-1">
              {`${calculatePercentage(
                item?.total_correct_answers,
                item?.total_questions,
              )}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartACCAScore
