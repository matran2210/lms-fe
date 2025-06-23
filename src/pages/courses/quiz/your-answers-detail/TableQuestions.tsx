import SappTable from '@components/base/SappTable'
import { convertSecondsToMinutesSeconds, roundNumber } from '@utils/helpers'
import { removeHtmlTags, truncateString } from '@utils/index'

import 'aos/dist/aos.css'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import _ from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'
import {
  ANIMATION,
  COMMON_TEXT_ENUM,
  GRADE_STATUS,
  PageLink,
  QUESTION_TYPES,
} from 'src/constants'
import { IAnswer, IQuizAttemptChartType } from 'src/type'
import { CoursesAPI } from '../../../api/courses/index'
import { CloseIcon } from '@assets/icons'
import Tooltip from 'src/common/Tooltip'

const commonHeaderClass = 'text-left p-0 text-sm text-[#A1A1A1] font-semibold'

const DEFAULT_PAGESIZE = 20

interface ScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
  type: IQuizAttemptChartType
  gradingStatus?: string
}

const TableQuestions = ({
  className,
  type,
  gradingStatus,
  yourScoreDetailRef,
}: ScoreDetailProps) => {
  const router = useRouter()

  const headers = [
    {
      label: '#',
      className: clsx(commonHeaderClass, 'min-w-[20px] xl:min-w-[50px]'),
    },
    {
      label: 'Question',
      className: clsx(commonHeaderClass, 'min-w-[180px]'),
    },
    {
      label: 'Section',
      className: clsx(commonHeaderClass, 'min-w-[180px]'),
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
      className: clsx(commonHeaderClass, ' min-w-20 !pr-0 text-center'),
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
          no_group_view: true,
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

  return (
    <div
      id="sapp-drawer-test-result-list"
      className={`!h-fit min-h-[237px] bg-white px-5 py-4 shadow-sidebar md:px-11 md:py-6 2xl:px-24 ${className}`}
      data-aos={ANIMATION.DATA_AOS}
      ref={yourScoreDetailRef}
    >
      <div className="flex items-center gap-x-3">
        <div className="mb-6 text-lg font-semibold text-[#050505] xl:text-xl xl:font-medium">
          Your Answer Details{' '}
          <span className="ml-5 rounded-sm bg-[#FFB8001A] px-1 py-1.5 text-base text-[#FFB800]">
            Awaiting Grading
          </span>
        </div>
        {router?.query?.attempt && (
          <div className="mb-6 text-base text-[#A1A1A1]">{`attempt: ${router?.query?.attempt}`}</div>
        )}
      </div>
      <div
        className="absolute right-6 top-4 ml-auto cursor-pointer"
        onClick={() => {
          router.push(
            localStorage.getItem('previousCourseUrl') ?? PageLink.COURSES,
          )
        }}
      >
        <CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />
      </div>
      <div className="block pl-4">
        <SappTable
          headers={headers}
          loading={isLoading}
          isCheckedAll={true}
          onChange={() => {}}
          hasCheck={false}
          classTable="w-full"
        >
          {allData?.map((answer, index) => {
            return (
              <React.Fragment key={answer?.id}>
                <tr key={answer?.id}>
                  <td className="sapp-border p-0 pr-3 font-semibold text-[#A1A1A1]">
                    {index + 1}
                  </td>

                  {/* Question */}
                  <td className="sapp-border p-0 pr-4">
                    <Tooltip
                      placement="topLeft"
                      title={
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              answer?.question?.question_content ?? '--',
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
                              `/explanation/${answer?.id}?title=Your Answers Detail&type=quiz`,
                            )
                          }
                        }}
                      />
                    </Tooltip>
                  </td>

                  {/* Section */}
                  <td
                    className="sapp-border my-5 line-clamp-1 p-0 text-start text-[#050505]"
                    title={
                      answer?.question?.question_filter?.part?.name ?? '--'
                    }
                  >
                    <Tooltip
                      color="white"
                      placement="topLeft"
                      title={answer?.question?.question_filter?.part?.name}
                    >
                      {truncateString(
                        answer?.question?.question_filter?.part?.name ?? '--',
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
                        <>{answer?.is_correct ? 'Correct' : 'Incorrect'}</>
                      ) : (
                        <>
                          {gradingStatus === GRADE_STATUS.FINISHED_GRADING
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
                          answer?.question?.question_report?.ratio || 0,
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
      <span ref={ref} />
    </div>
  )
}

export default TableQuestions
