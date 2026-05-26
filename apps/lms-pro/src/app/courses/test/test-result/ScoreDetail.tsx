'use client'
import { SappBaseTable } from '@lms/ui'
import {
  convertSecondsToMinutesSeconds,
  roundNumber,
  truncateString,
} from '@lms/utils'

import { CollapseArrowIcon } from '@lms/assets'
import {
  ANIMATION,
  COMMON_TEXT_ENUM,
  GRADE_STATUS,
  IAnswer,
  IQuizAttempt,
  IQuizAttemptChartType,
  QUESTION_TYPES,
} from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { Tooltip } from '@lms/ui'
import { htmlToRaw } from '@lms/utils'
import { Collapse } from 'antd'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import { groupBy } from 'lodash'
import Image from 'next/image'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'
import { CoursesAPI } from 'src/api/courses'
import { PageLink } from 'src/constants/routers'

const commonHeaderClass = 'font-medium leading-6 text-gray py-2 pb-4 md:pb-6'

const DEFAULT_PAGESIZE = 20

interface ScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
  type: IQuizAttemptChartType
  gradingStatus?: string
  quizAttempt?: IQuizAttempt
  isTeacher?: boolean
  numberSelectedResponse?: number
}

const ScoreDetail = ({
  className,
  gradingStatus,
  yourScoreDetailRef,
  quizAttempt,
  numberSelectedResponse,
  isTeacher
}: ScoreDetailProps) => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const query = Object.fromEntries(searchParams.entries())
  const { isMobileView } = useTailwindBreakpoint()

  const headers = [
    {
      label: 'Q#',
      className: clsx(commonHeaderClass, 'xl:min-w-[50px] text-center'),
    },
    {
      label: 'Question Name',
      className: clsx(commonHeaderClass, 'min-w-[200px] text-start'),
    },
    ...(isMobileView
      ? []
      : [
        {
          label: 'Type',
          className: clsx(commonHeaderClass, 'min-w-[120px] text-center'),
        },
        {
          label: 'Result',
          className: clsx(commonHeaderClass, 'min-w-[200px] text-center'),
        },
        {
          label: 'Time Spent',
          className: clsx(
            commonHeaderClass,
            ' min-w-[100px] !pr-0 text-center',
          ),
        },
      ]),
  ]

  const {
    data: scoreDetails,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['scoreDetails', params.id],
    queryFn: async ({ pageParam }) => {
      const res = await CoursesAPI.getQuizAttemptsTable(params.id as string, {
        page_index: pageParam,
        page_size: DEFAULT_PAGESIZE,
      })
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
    enabled: params.id !== undefined,
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
        ? ' text-info bg-info-50'
        : data?.question?.qType === QUESTION_TYPES.ESSAY &&
          data?.active === COMMON_TEXT_ENUM.SUBMITED
          ? ' text-info bg-info-50'
          : ' text-gray-400 bg-gray-100'
    }
    return data?.is_correct
      ? ' text-success-600 bg-success-50'
      : ' text-error bg-error-50'
  }

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView, hasNextPage])

  // Flatten pages into a single array
  const allData = scoreDetails?.pages.flatMap((page) => page?.answers) || []
  // Group data by program
  const groupedData = groupBy(allData, (item) => item?.belong_to?.id)
  // const isACCAHighCodes =
  //   !F_LOW_CODES.includes(subjectCode as string) &&
  //   QuizAttemptChartType.ACCA === type
  const explanationUrl = (id: string) => isTeacher ? `${PageLink.TEACHER_EXPLANATION}/${id}?title=My Course` : `/explanation/${id}?title=My Course`
  return (
    <div
      id="sapp-drawer-test-result-list"
      data-aos={ANIMATION.DATA_AOS}
      ref={yourScoreDetailRef}
      className={clsx(` md:mb-[75px] lg:mb-[80px] xl:mb-0 ${className}`, {
        'mb-[100px] sm:mb-[50px]': (numberSelectedResponse || 0) >= 10,
        'mb-[50px]': (numberSelectedResponse || 0) < 10,
      })}
    >
      <div className="mb-4 flex items-center gap-x-3">
        <div className="text-lg font-semibold md:text-xl">
          Score Details{' '}
          {!query?.attempt && quizAttempt?.number_of_attempts && (
            <span className="text-sm text-gray-400 md:text-base">
              attempt:{' '}
              {Number(quizAttempt?.total_attempt_time || 0) > 0
                ? `${quizAttempt?.number_of_attempts}/${quizAttempt?.total_attempt_time}`
                : quizAttempt?.number_of_attempts}
            </span>
          )}
        </div>
        {query?.attempt && (
          <div className="text-sm leading-7 text-gray-400 md:text-base">{`attempt: ${query?.attempt}`}</div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <LoadingScoreDetail />
        ) : (
          <>
            {Object.entries(groupedData).map(([program, rows]) => (
              <Collapse
                className="test-collapse rounded-xl bg-white shadow-small lg:rounded-2xl"
                key={program}
                ghost
                expandIconPosition="end"
                defaultActiveKey={[0]}
                items={[
                  {
                    key: 0,
                    label: (
                      <span className="text-base font-medium text-gray-800 md:text-lg">
                        {rows[0]?.belong_to?.name
                          ?.split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(' ')}
                      </span>
                    ),
                    children: (
                      <div>
                        <SappBaseTable
                          headers={headers}
                          loading={isLoading}
                          isCheckedAll={true}
                          onChange={() => { }}
                          hasCheck={false}
                          classTable="w-full"
                        >
                          {rows?.map((answer) => {
                            return (
                              <React.Fragment key={answer?.id}>
                                <tr
                                  key={answer?.id}
                                  className={
                                    'align-baseline text-base text-gray-800 hover:bg-gray-100'
                                  }
                                >
                                  <td className="pr-3 text-center">
                                    {answer?.index}
                                  </td>

                                  {/* Question */}
                                  <td className="pr-4">
                                    <div>
                                      <Tooltip
                                        title={
                                          answer?.question?.question_content &&
                                          DOMPurify.sanitize(
                                            htmlToRaw(
                                              answer?.question
                                                ?.question_content,
                                            ) ?? '--',
                                          )
                                        }
                                      >
                                        <div
                                          className={`line-clamp-1 cursor-pointer text-sm md:text-base`}
                                          onClick={() => {
                                            if (answer?.id) {
                                              router.push(
                                                explanationUrl(answer?.id)
                                              )
                                            }
                                          }}
                                        >
                                          {
                                            answer?.question
                                              ?.question_content &&
                                            // truncateString(
                                            DOMPurify.sanitize(
                                              htmlToRaw(
                                                answer?.question
                                                  ?.question_content,
                                              ) ?? '--',
                                            )
                                            //   isMobileView ? 60 : 40,
                                            // )
                                          }
                                        </div>
                                      </Tooltip>
                                      <Tooltip
                                        title={
                                          answer?.question?.question_filter
                                            ?.chapter?.name
                                        }
                                      >
                                        <span className="text-sm text-gray-400">
                                          {truncateString(
                                            answer?.question?.question_filter
                                              ?.chapter?.name ?? '',
                                            40,
                                          )}
                                        </span>
                                      </Tooltip>
                                    </div>
                                  </td>

                                  {/* Type */}
                                  <td className="hidden pr-4 md:table-cell">
                                    <div className="text-center">
                                      {getTypeName(answer?.question?.qType)}
                                    </div>
                                  </td>

                                  {/* Result */}
                                  <td
                                    className={`hidden pr-4 text-center md:table-cell`}
                                  >
                                    <div className="flex w-full items-center justify-center gap-3">
                                      <div
                                        className={clsx(
                                          renderBoxesAndLineClass(
                                            getTypeName(
                                              answer?.question?.qType,
                                            ),
                                            answer,
                                          ),
                                          'inline-block rounded px-3',
                                        )}
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
                                      <div className="h-[14px] w-[1px] bg-gray-300" />
                                      {answer?.question?.qType !== 'ESSAY' && (
                                        <div className="flex w-[80px] items-center justify-start gap-1">
                                          <Image
                                            src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                                            alt="Correct"
                                            className="mr-1 shrink-0"
                                            width={16}
                                            height={16}
                                          />
                                          {roundNumber(
                                            answer?.question?.question_report
                                              ?.ratio || 0,
                                          )}
                                          %
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  {/* Time Spent */}
                                  <td className="m-6 hidden p-0 text-center md:table-cell">
                                    {(() => {
                                      if (answer?.time_spent !== null) {
                                        return convertSecondsToMinutesSeconds(
                                          answer?.time_spent || 0,
                                        )
                                      } else {
                                        return '---'
                                      }
                                    })()}
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                          })}
                        </SappBaseTable>
                      </div>
                    ),
                  },
                ]}
                expandIcon={({ isActive }) => (
                  <CollapseArrowIcon selected={isActive} />
                )}
              />
            ))}
          </>
        )}
      </div>
      <span ref={ref} />
    </div>
  )
}

const LoadingScoreDetail = () => {
  return (
    <div className="rounded-xl bg-white p-6">
      {/* Fake table header */}
      <div className="border-gray-200 mb-3 flex w-full justify-between border-b pb-2">
        <div className="h-8 w-20 rounded bg-skeleton" />
        <div className="h-8 w-1/3 rounded bg-skeleton" />
        <div className="hidden h-8 w-20 rounded bg-skeleton md:block" />
        <div className="hidden h-8 w-20 rounded bg-skeleton md:block" />
        <div className="hidden h-8 w-24 rounded bg-skeleton md:block" />
      </div>

      {/* Fake table rows */}
      <div className="space-y-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={clsx(
                'bg-gray-50 flex items-center justify-between rounded-lg py-3',
              )}
            >
              <div className="h-8 w-20 rounded bg-skeleton" />
              <div className="h-8 w-1/3 rounded bg-skeleton" />
              <div className="hidden h-8 w-16 rounded bg-skeleton md:block" />
              <div className="hidden h-8 w-20 rounded bg-skeleton md:block" />
              <div className="hidden h-8 w-24 rounded bg-skeleton md:block" />
            </div>
          ))}
      </div>
    </div>
  )
}

export default ScoreDetail
