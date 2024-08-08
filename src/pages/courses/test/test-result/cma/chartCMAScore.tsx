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
    <div className="mb-4 w-full max-w-full items-start overflow-x-auto bg-white px-11 py-6 shadow-sidebar xl:mb-6 xl:px-24">
      <div className="sticky left-0 flex flex-row justify-between">
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
      <div>
        <div className="relative flex h-[250px] px-6">
          <div>
            <div className="test-result__passing-score absolute bottom-3/4 z-10 flex h-0 w-[calc(100%-48px)] items-center border-t border-dotted border-gray-2 hover:border-state-info">
              <div className="relative -left-6 bottom-[75%] text-medium-sm font-normal text-black-1">
                <span className="relative">75</span>
              </div>
            </div>
            <div className="absolute bottom-1/2 z-10 flex h-0 w-[calc(100%-48px)] items-center border-t border-dotted border-gray-2 hover:border-state-info">
              <div className="relative -left-6 bottom-[50%] text-medium-sm font-normal text-black-1">
                <span className="relative">50</span>
              </div>
            </div>
          </div>
          <div>
            <div className="relative bottom-0 h-full w-full border-b border-l border-gray-2" />
            <div className="flex w-full flex-row">
              <div className="mt-4 flex shrink-0 flex-col justify-between bg-white py-2">
                <div className="text-medium-sm text-black-1">Part</div>
                <div className="text-medium-sm text-black-1">Weight </div>
              </div>
              <div className="flex-start flex flex-row">
                {data?.map((item: any, index: number) => (
                  <div
                    key={item?.id + index}
                    className="relative flex w-28 shrink-0 flex-col items-center justify-between gap-1 px-3 py-2 first:ml-6 4xl:w-[150px]"
                  >
                    <div className="absolute bottom-full left-1/2 h-[250px] w-14 -translate-x-1/2">
                      <div
                        className="absolute bottom-0 w-14 border border-l-primary border-r-primary border-t-primary bg-secondary "
                        style={{
                          height: `${
                            (item?.total_correct_answers /
                              item?.total_questions) *
                            100
                          }%`,
                        }}
                      />
                      <div className="absolute -bottom-2.5 left-1/2 h-2.5 w-[1px] bg-black-1" />
                    </div>
                    <div className="mt-4 line-clamp-2 w-full text-center text-medium-sm font-medium text-bw-1">
                      {item?.short_name}
                    </div>
                    <div className="w-full text-center text-medium-sm font-normal text-black-1">
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
      </div>
      <div className="sticky left-0 mt-28 grid grid-cols-2 content-start gap-3">
        {data?.map((item: any, index: number) => (
          <div key={index} className="w-auto">
            <div className="w-full break-all py-2 text-medium-sm font-medium leading-4 text-bw-1">
              {`${item?.short_name} - ${item?.title}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartCMAScore
