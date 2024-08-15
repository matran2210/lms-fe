import SappTable from '@components/base/SappTable'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { roundNumber, convertSecondsToMinutesSeconds } from '@utils/helpers'
import { ANIMATION, QUESTION_TYPES } from 'src/constants'
import 'aos/dist/aos.css'
import { parseHTMLToString } from '@utils/index'
import { CoursesAPI } from '../../../api/courses/index'
import { useQuery } from 'react-query'
import { IAnswearGroup, IAnswer, IScoreDetails } from 'src/type'
import Image from 'next/image'
import clsx from 'clsx'

const commonHeaderClass =
  'text-left p-0 text-medium-sm text-gray-1 font-semibold'
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
    label: 'Module',
    className: clsx(commonHeaderClass, 'min-w-[198px]'),
  },
  {
    label: 'Type',
    className: clsx(commonHeaderClass, 'min-w-[110px]'),
  },
  {
    label: 'Result',
    className: clsx(commonHeaderClass, 'min-w-[80px]'),
  },
  {
    label: '',
    className: clsx(commonHeaderClass, 'min-w-[40px]'),
  },
  {
    label: 'Time Spent',
    className: clsx(commonHeaderClass, ' min-w-[95px] !pr-0 text-center'),
  },
]
const DEFAULT_PAGE_INDEX = 1
const DEFAULT_PAGESIZE = 20

interface YourScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
}

const YourScoreDetail = ({
  className,
  yourScoreDetailRef,
}: YourScoreDetailProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX)
  const [scoreDetails, setScoreDetails] = useState<IScoreDetails>()

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
      <div className="mb-4 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
        Score Details
      </div>
      <div className="block pl-4">
        <SappTable
          headers={headers}
          loading={loading}
          isCheckedAll={true}
          onChange={() => {}}
          hasCheck={false}
          // classTableRes="overflow-x-auto"
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
                        key={e?.id}
                      >
                        <td className="p-0 pr-1 text-bw-1">{e.index}</td>
                        <td className="p-0 pr-4">
                          <div
                            className={`line-clamp-1 cursor-pointer text-bw-1 hover:font-semibold`}
                            dangerouslySetInnerHTML={{
                              __html: String(
                                e?.question?.question_content ?? '--',
                              ),
                            }}
                            title={
                              parseHTMLToString(
                                e?.question?.question_content,
                              ) ?? '--'
                            }
                            onClick={() => {
                              if (e.id) {
                                router.push(
                                  `/explanation/${e.id}?title=My Course`,
                                )
                              }
                            }}
                          ></div>
                        </td>
                        <td
                          className="text-starttext-bw-1 my-5 line-clamp-1 p-0"
                          title={
                            e?.question?.question_filter_id?.part?.name ?? '--'
                          }
                        >
                          {e?.question?.question_filter_id?.part?.name ?? '--'}
                        </td>
                        <td className="p-0 pr-4 text-bw-1">
                          <div className="min-w-[111px]">
                            {getTypeName(e?.question?.qType ?? '--')}
                          </div>
                        </td>
                        <td
                          className={`pr-4 
                      ${renderBoxesAndLineClass(getTypeName(e?.question?.qType ?? '--'), e)}
                    `}
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
                        </td>
                        <td className="m-6 p-0 pr-4 text-gray-1">
                          {e?.question?.qType !== 'ESSAY' && (
                            <div className="ml-1 flex items-center justify-start gap-2">
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

export default YourScoreDetail
