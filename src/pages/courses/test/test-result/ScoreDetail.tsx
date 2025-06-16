import SappTable from '@components/base/SappTable'
import { convertSecondsToMinutesSeconds, roundNumber } from '@utils/helpers'
import { removeHtmlTags, truncateString } from '@utils/index'

import { Collapse } from 'antd'
import 'aos/dist/aos.css'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import { groupBy } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'
import Tooltip from 'src/common/Tooltip'
import { COMMON_TEXT_ENUM, GRADE_STATUS, QUESTION_TYPES } from 'src/constants'
import { IAnswer, IQuizAttemptChartType, QuizAttemptChartType } from 'src/type'
import { CoursesAPI } from '../../../api/courses/index'

const commonHeaderClass = 'text-left p-0 text-sm text-[#A1A1A1] font-semibold'

const DEFAULT_PAGESIZE = 20

interface ScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
  type: IQuizAttemptChartType
  gradingStatus?: string
}

const ScoreDetail = ({
  className,
  type,
  gradingStatus,
  yourScoreDetailRef,
}: ScoreDetailProps) => {
  const router = useRouter()

  const headers = [
    {
      label: 'Question',
      className: clsx(commonHeaderClass, 'min-w-[20px] xl:min-w-[50px]'),
    },
    {
      label: 'Question Name',
      className: clsx(commonHeaderClass, 'min-w-[180px]'),
    },
    {
      label: type === QuizAttemptChartType.CFA ? 'Module' : 'Chapter',
      className: clsx(commonHeaderClass, 'min-w-[198px]'),
    },
    {
      label: 'Type',
      className: clsx(commonHeaderClass, 'min-w-[150px]'),
    },
    {
      label: 'Result',
      className: clsx(commonHeaderClass),
    },
    {
      label: 'Time Spent',
      className: clsx(commonHeaderClass, ' min-w-[80px] !pr-0 text-center'),
    },
  ]

  const {
    data: scoreDetails,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['scoreDetails', router.query.id],
    queryFn: async ({ pageParam }) => {
      const res = await CoursesAPI.getQuizAttemptsTable(
        router.query.id as string,
        {
          page_index: pageParam,
          page_size: DEFAULT_PAGESIZE,
        },
      )
      if (res.success) {
        return res.data
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage?.metadata?.page_index < lastPage?.metadata?.total_pages
          ? lastPage?.metadata?.page_index + 1
          : undefined
      }
    },
    enabled: router.query.id !== undefined,
    retry: false,
  })

  const { ref, inView } = useInView({
    threshold: 0.9,
    skip: isFetchingNextPage || isLoading,
    delay: 300,
  })

  // Hàm ánh xạ giá trị enum với tên tương ứng
  const getTypeName = (type: QUESTION_TYPES | undefined): string => {
    switch (type) {
      case QUESTION_TYPES.TRUE_FALSE:
        return 'True/False'
      case QUESTION_TYPES.ONE_CHOICE:
        return 'One Choice'
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return 'Multiple Choice'
      case QUESTION_TYPES.MATCHING:
        return 'Matching'
      case QUESTION_TYPES.SELECT_WORD:
        return 'Select Word'
      case QUESTION_TYPES.FILL_WORD:
        return 'Fill Up'
      case QUESTION_TYPES.DRAG_DROP:
        return 'Drag Drop'
      case QUESTION_TYPES.ESSAY:
        return 'Constructed'
      default:
        return '--'
    }
  }

  // Xử lý scroll phân trang
  const renderBoxesAndLineClass = (type: string, data: IAnswer | undefined) => {
    if (type === 'Constructed') {
      return gradingStatus === GRADE_STATUS.FINISHED_GRADING
        ? ' text-[#4077E0] border-[#18355D]'
        : data?.question?.qType === QUESTION_TYPES.ESSAY &&
            data?.active === COMMON_TEXT_ENUM.SUBMITED
          ? ' text-[#18355D] border-[#18355D]'
          : ' text-[#A1A1A1] border-[#A1A1A1]'
    }
    return data?.is_correct
      ? ' text-success-600 border-[#397839]'
      : ' text-error border-[#B90E0A]'
  }

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView, hasNextPage])

  // Flatten pages into a single array
  const allData = scoreDetails?.pages.flatMap((page) => page?.answers) || []
  // Group data by program
  const groupedData = groupBy(allData, (item) => item?.belong_to.id)
  return (
    <div
      id="sapp-drawer-test-result-list"
      // data-aos={ANIMATION.DATA_AOS}
      ref={yourScoreDetailRef}
      className={`${className}`}
    >
      <div className="flex items-center gap-x-3">
        <div className="mb-4 text-xl font-semibold ">Score Details</div>
        {router?.query?.attempt && (
          <div className="mb-6 text-base text-gray-400">{`attempt: ${router?.query?.attempt}`}</div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {Object.entries(groupedData).map(([program, rows]) => (
          <Collapse
            className="rounded-xl bg-white px-2 py-3 shadow-small hover:bg-primary-50"
            key={program}
            ghost
            expandIconPosition="end"
            items={[
              {
                key: 0,
                label: (
                  <span className="text-base font-semibold">
                    {rows[0]?.belong_to?.name}
                  </span>
                ),
                children: (
                  <div>
                    <SappTable
                      headers={headers}
                      loading={isLoading}
                      isCheckedAll={true}
                      onChange={() => {}}
                      hasCheck={false}
                      classTable="w-full"
                    >
                      {rows?.map((answer) => {
                        return (
                          <React.Fragment key={answer?.id}>
                            <tr key={answer?.id}>
                              <td className="sapp-border p-0 pr-3 font-semibold text-[#A1A1A1]">
                                {answer?.index}
                              </td>

                              {/* Question */}
                              <td className="sapp-border p-0 pr-4">
                                <Tooltip
                                  title={
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                          answer?.question?.question_content ??
                                            '--',
                                        ),
                                      }}
                                    />
                                  }
                                >
                                  <div
                                    className={`line-clamp-1 cursor-pointer text-[#050505] hover:font-semibold`}
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        removeHtmlTags(
                                          answer?.question?.question_content,
                                        ) ?? '--',
                                      ),
                                    }}
                                    onClick={() => {
                                      if (answer?.id) {
                                        router.push(
                                          `/explanation/${answer?.id}?title=My Course`,
                                        )
                                      }
                                    }}
                                  />
                                </Tooltip>
                              </td>

                              {/* Chapter/Module */}
                              <td
                                className="sapp-border my-5 line-clamp-1 p-0 text-start text-[#050505]"
                                title={
                                  answer?.question?.question_filter?.chapter
                                    ?.name ?? '--'
                                }
                              >
                                <Tooltip
                                  title={
                                    answer?.question?.question_filter?.chapter
                                      ?.name
                                  }
                                >
                                  {truncateString(
                                    answer?.question?.question_filter?.chapter
                                      ?.name ?? '--',
                                    25,
                                  )}
                                </Tooltip>
                              </td>

                              {/* Type */}
                              <td className="sapp-border p-0 pr-4 text-[#050505]">
                                <div className="min-w-[111px]">
                                  {getTypeName(answer?.question?.qType)}
                                </div>
                              </td>

                              {/* Result */}
                              <td
                                className={`sapp-border flex justify-between gap-12 pr-4`}
                              >
                                <div
                                  className={`${renderBoxesAndLineClass(getTypeName(answer?.question?.qType), answer)}`}
                                >
                                  {answer?.question?.qType !== 'ESSAY' ? (
                                    <>
                                      {answer?.is_correct
                                        ? 'Correct'
                                        : 'Incorrect'}
                                    </>
                                  ) : (
                                    <>
                                      {gradingStatus ===
                                      GRADE_STATUS.FINISHED_GRADING
                                        ? 'Graded'
                                        : answer?.active === 'SUBMITED'
                                          ? 'Completed'
                                          : 'Not Completed'}
                                    </>
                                  )}
                                </div>
                                {answer?.question?.qType !== 'ESSAY' && (
                                  <div className="ml-1 flex items-center justify-start gap-2 text-[#A1A1A1]">
                                    <Image
                                      src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                                      alt="Correct"
                                      className="mr-1 text-success-600"
                                      width={16}
                                      height={16}
                                      layout="fixed"
                                    />
                                    {roundNumber(
                                      answer?.question?.question_report
                                        ?.ratio || 0,
                                    )}
                                    %
                                  </div>
                                )}
                              </td>

                              {/* Time Spent */}
                              <td className="sapp-border m-6 p-0">
                                <div className="text-center">
                                  {(() => {
                                    if (answer?.time_spent !== null) {
                                      return convertSecondsToMinutesSeconds(
                                        answer?.time_spent || 0,
                                      )
                                    } else {
                                      return '---'
                                    }
                                  })()}
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        )
                      })}
                    </SappTable>
                  </div>
                ),
              },
            ]}
          />
        ))}
      </div>
      <span ref={ref} />
    </div>
  )
}

export default ScoreDetail
