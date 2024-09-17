import SappTable from '@components/base/SappTable'
import { convertSecondsToMinutesSeconds, roundNumber } from '@utils/helpers'
import { truncateString } from '@utils/index'
import { Tooltip } from 'antd'
import 'aos/dist/aos.css'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { ANIMATION, QUESTION_TYPES } from 'src/constants'
import {
  IAnswearGroup,
  IAnswer,
  IQuizAttemptChartType,
  IScoreDetails,
  QuizAttemptChartType,
} from 'src/type'
import { CoursesAPI } from '../../../api/courses/index'

const commonHeaderClass =
  'text-left p-0 text-medium-sm text-gray-1 font-semibold'

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGESIZE = 20

interface ScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
  type: IQuizAttemptChartType
}

const ScoreDetail = ({
  className,
  yourScoreDetailRef,
  type,
}: ScoreDetailProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX)
  const [scoreDetails, setScoreDetails] = useState<IScoreDetails>()

  const headers = [
    {
      label: '#',
      className: clsx(commonHeaderClass, 'min-w-[20px] xl:min-w-[50px]'),
    },
    {
      label: 'Question',
      className: clsx(commonHeaderClass, 'min-w-[210px]'),
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
      className: clsx(commonHeaderClass, 'max-w-[130px]'),
    },
    {
      label: 'Time Spent',
      className: clsx(commonHeaderClass, ' min-w-[80px] !pr-0 text-center'),
    },
  ]

  useQuery(
    ['scoreDetails', router.query.id],
    async () => {
      const res = await CoursesAPI.getQuizAttemptsTable(
        router.query.id as string,
        {
          page_index: DEFAULT_PAGE_INDEX,
          page_size: DEFAULT_PAGESIZE,
        },
      )
      setScoreDetails(res.data)
    },
    {
      enabled: router.query.id !== undefined,
    },
  )

  // Hàm ánh xạ giá trị enum với tên tương ứng
  const getTypeName = (type: QUESTION_TYPES): string => {
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
  const requestOngoingRef = useRef(false)
  const fetchData = async (nextPageIndex: number) => {
    setLoading(true)
    try {
      if (requestOngoingRef.current) return
      requestOngoingRef.current = true
      const res = await CoursesAPI.getQuizAttemptsTable(
        router.query.id as string,
        {
          page_index: nextPageIndex,
          page_size: DEFAULT_PAGESIZE,
        },
      )
      if (scoreDetails && res?.data?.answers) {
        setScoreDetails((prevStages: any) => ({
          ...prevStages,
          answers: [...prevStages.answers, ...res.data.answers],
        }))
        setPageIndex(nextPageIndex)
        requestOngoingRef.current = false
      }
    } catch (error) {}
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  // Xử lý sự kiện scroll
  useEffect(() => {
    const divElement = document.getElementById('sapp-drawer-test-result-list')
    if (!divElement) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = divElement
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1) {
        const nextPageIndex = pageIndex + 1
        if (Number(scoreDetails?.meta?.total_pages) >= nextPageIndex) {
          fetchData(nextPageIndex)
        }
      }
    }
    divElement.addEventListener('scroll', handleScroll)
    // Cleanup function
    return () => {
      divElement.removeEventListener('scroll', handleScroll)
    }
  }, [fetchData, pageIndex])

  const renderBoxesAndLineClass = (type: string, data: IAnswer) => {
    if (type === 'Constructed') {
      return data?.question?.qType === 'ESSAY' && data?.active === 'SUBMITED'
        ? ' text-pinned-1 border-pinned-1'
        : ' text-gray-1 border-gray-1'
    }
    return data?.is_correct
      ? ' text-state-success border-success'
      : ' text-state-error border-error'
  }

  return (
    <div
      id="sapp-drawer-test-result-list"
      className={`!h-fit bg-white px-5 py-4 shadow-sidebar md:px-11 md:py-6 2xl:!mb-0 2xl:px-24 ${className}`}
      data-aos={ANIMATION.DATA_AOS}
      ref={yourScoreDetailRef}
    >
      <div className="mb-6 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
        Score Details
      </div>
      <div className="block pl-4">
        <SappTable
          headers={headers}
          loading={loading}
          isCheckedAll={true}
          onChange={() => {}}
          hasCheck={false}
          classTable="w-full"
        >
          <>
            {scoreDetails?.answer_groups?.map((ansg: IAnswearGroup) => {
              return (
                <React.Fragment key={ansg.id}>
                  <tr>
                    <td
                      className="w-full pt-8 text-base font-medium text-bw-1"
                      colSpan={6}
                    >
                      {ansg?.name}
                    </td>
                  </tr>
                  {ansg?.answers?.map((e: IAnswer) => {
                    return (
                      <tr
                        className="border-b border-dashed border-gray-2"
                        key={e?.question_id}
                      >
                        {/* # */}
                        <td className="p-0 pr-1 text-bw-1">{e.index}</td>

                        {/* Question */}
                        <td className="p-0 pr-4">
                          <Tooltip
                            color="white"
                            title={
                              <div
                                // className="h-24 overflow-y-scroll"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    e?.question?.question_content ?? '--',
                                  ),
                                }}
                              />
                            }
                          >
                            <div
                              className={`line-clamp-1 cursor-pointer text-bw-1 hover:font-semibold`}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  e?.question?.question_content ?? '--',
                                ),
                              }}
                              onClick={() => {
                                if (e.id) {
                                  router.push(
                                    `/explanation/${e.id}?title=My Course`,
                                  )
                                }
                              }}
                            />
                          </Tooltip>
                        </td>

                        {/* Chapter/Module */}
                        <td
                          className="text-starttext-bw-1 my-5 line-clamp-1 p-0"
                          title={
                            e?.question?.question_filter?.part?.name ?? '--'
                          }
                        >
                          {truncateString(
                            e?.question?.question_filter?.part?.name ?? '--',
                            15,
                          )}
                        </td>

                        {/* Type */}
                        <td className="p-0 pr-4 text-bw-1">
                          <div className="min-w-[111px]">
                            {getTypeName(e?.question?.qType ?? '--')}
                          </div>
                        </td>

                        {/* Result */}
                        <td className={`flex justify-between gap-4 pr-4`}>
                          <div
                            className={`${renderBoxesAndLineClass(getTypeName(e?.question?.qType ?? '--'), e)}`}
                          >
                            {e?.question?.qType !== 'ESSAY' ? (
                              <>{e?.is_correct ? 'Correct' : 'Incorrect'}</>
                            ) : (
                              <>
                                {e?.active === 'SUBMITED'
                                  ? 'Completed'
                                  : 'Not Completed'}
                              </>
                            )}
                          </div>
                          {e?.question?.qType !== 'ESSAY' && (
                            <div className="ml-1 flex items-center justify-start gap-2 text-gray-1">
                              <Image
                                src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                                alt="Correct"
                                className="mr-1 text-state-success"
                                width={16}
                                height={16}
                                layout="fixed"
                              />
                              {roundNumber(
                                e?.question?.question_report?.ratio || 0,
                              )}
                              %
                            </div>
                          )}
                        </td>

                        {/* Time Spent */}
                        <td className="m-6 p-0">
                          <div className="text-center">
                            {(() => {
                              if (e?.time_spent !== null) {
                                return convertSecondsToMinutesSeconds(
                                  e?.time_spent || 0,
                                )
                              } else {
                                return '---'
                              }
                            })()}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </>
        </SappTable>
      </div>
    </div>
  )
}

export default ScoreDetail
