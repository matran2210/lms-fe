interface DataItem {
  question_topic_id: string
  title: string
  total_correct_answers: number
  total_questions: number
}

interface IProps {
  data: DataItem[]
}

const ChartCFAScore = ({ data }: IProps) => {
  return (
    <div className="block">
      <div className="text-xl font-medium text-bw-1 mb-6">
        Your Performance by Topic Area
      </div>
      <div className="flex w-full relative mb-4">
        <div className="absolute top-[43%] -translate-y-1/2 -left-11 text-medium-sm text-bw-1 font-normal -rotate-90 shrink-0">
          Available Points
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-27 w-0.5 h-full border-r border-gray-1"></div>
        <div className="h-40 w-full ml-9">
          <div className="flex items-center w-full mt-10">
            <span className="text-medium-sm text-bw-1 font-normal pr-7">
              70%
            </span>
            <div className="w-full border-b border-gray-1"></div>
          </div>
          <div className="flex items-center w-full mt-4">
            <span className="text-medium-sm text-bw-1 font-normal pr-7">
              50%
            </span>
            <div className="w-full border-b border-gray-1"></div>
          </div>
        </div>
        {data.map((item, index) => (
          <div
            key={item?.question_topic_id}
            className="w-16 h-1 bg-primary absolute"
            style={{
              left: `${14.2 * (index + 1)}%`,
              bottom: `${
                (item?.total_correct_answers / item.total_questions) * 100
              }%`,
            }}
          ></div>
        ))}
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-col shrink-0 justify-between my-3">
          <div className="text-medium-sm">Topic Area</div>
          <div className="text-medium-sm">Topic Weight</div>
        </div>
        <div className="bg-gray-4 px-6 py-3 w-full overflow-x-auto">
          <div className="flex flex-row gap-6 flex-start">
            {data?.map((item: any) => (
              <div
                key={item?.id}
                className="flex flex-col w-full max-w-27 justify-between shrink-0 items-start gap-1"
              >
                <div className="text-bw-1 font-medium">{item?.title}</div>
                <div className="text-medium-sm text-gray-1 font-normal">
                  {`${
                    (item?.total_correct_answers / item?.total_questions) * 100
                  }%`}
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
