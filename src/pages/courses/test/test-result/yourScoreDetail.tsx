import SappTable from '@components/base/SappTable'
import { Dispatch } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { roundNumber, convertSecondsToMinutesSeconds } from '@utils/helpers'
import { ANIMATION, QUESTION_TYPES } from 'src/constants'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { parseHTMLToString } from '@utils/index'

const headers = [
  {
    label: '#',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[44px] xl:min-w-62px',
  },
  {
    label: 'Question',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[210px]',
  },
  {
    label: 'Section (Part)',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[210px]',
  },
  {
    label: 'Type',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[117px]',
  },
  {
    label: 'Result',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[70px]',
  },
  {
    label: '',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[117px]',
  },
  {
    label: 'Time Spent',
    className:
      'text-left p-0 pb-2 text-medium-sm text-gray-1 font-semibold min-w-[95px] !pr-0 text-center',
  },
]

interface YourScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
}

const YourScoreDetail = ({
  className,
  yourScoreDetailRef,
}: YourScoreDetailProps) => {
  const [scoreDetail, setScoreDetail] = useState<any>({
    answers: [],
    meta: {},
  })
  const router = useRouter()

  const fetchScoreDetail = async (page_index: number, page_size: number) => {
    try {
      const res = await CourseTestApi.getQuizAttemptsTable(
        router.query.id as string,
        page_index,
        page_size,
      )
      return res
    } catch (error) {}
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return
    }
    handlNextPage()
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scoreDetail])

  const handlNextPage = async () => {
    const totalPages = scoreDetail?.meta?.total_pages
    const pageIndex = scoreDetail?.meta?.page_index
    const pageSize = scoreDetail?.meta?.page_size
    if (totalPages && pageIndex < totalPages) {
      const res = await fetchScoreDetail(pageIndex + 1, pageSize)
      const results = scoreDetail?.answers?.concat(res?.data?.answers)
      setScoreDetail({
        meta: res?.data?.meta,
        answers: results,
      })
    }
  }

  const getScoreDetail = async () => {
    const res = await fetchScoreDetail(1, 10)
    setScoreDetail(res?.data)
  }

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

  useEffect(() => {
    getScoreDetail()
  }, [router])

  return (
    <div
      className={`overflow-y-auto bg-white px-6 xl:px-24 py-6 xl:max-w-[1144px] max-h-full shadow-sidebar ${className}`}
      data-aos={ANIMATION.DATA_AOS}
      ref={yourScoreDetailRef}
    >
      <div className="text-lg-xl xl:text-xl font-semibold xl:font-medium text-bw-1 mb-6">
        Your Score Details
      </div>
      <div className="block pl-4 overflow-x-auto">
        <SappTable
          headers={headers}
          loading={true}
          data={scoreDetail?.answers}
          isCheckedAll={true}
          onChange={() => {}}
          hasCheck={false}
          classTableRes="!overflow-x-hidden"
        >
          <>
            {scoreDetail?.answers?.map((e: any, index: number) => {
              return (
                <tr
                  className="border-dashed border-b border-gray-2"
                  key={e?.id}
                >
                  <td className="p-0 pr-1 text-bw-1">{index + 1}</td>
                  <td className="p-0 pr-4 text-start max-w-[210px]">
                    <div
                      className={`text-bw-1 line-clamp-1 cursor-pointer hover:font-semibold`}
                      dangerouslySetInnerHTML={{
                        __html: String(e?.question?.question_content ?? '--'),
                      }}
                      title={
                        parseHTMLToString(e?.question?.question_content) ?? '--'
                      }
                      onClick={() => {
                        if (e.id) {
                          router.push(`/explanation/${e.id}?title=My Course`)
                        }
                      }}
                    ></div>
                  </td>
                  <td
                    className="p-0 my-5 text-starttext-bw-1 line-clamp-1"
                    title={e?.question?.question_filter_id?.part?.name ?? '--'}
                  >
                    {e?.question?.question_filter_id?.part?.name ?? '--'}
                  </td>
                  <td className="p-0 pr-4 text-start text-bw-1">
                    <div className="min-w-[111px]">
                      {getTypeName(e?.question?.qType ?? '--')}
                    </div>
                  </td>
                  <td
                    className={`text-start pr-7
                      ${
                        e?.is_correct || e?.active === 'SUBMITED'
                          ? ' text-state-success'
                          : ' text-state-error'
                      }
                    `}
                  >
                    {e?.question?.qType !== 'ESSAY' ? (
                      <>{e?.is_correct ? 'Correct' : 'Incorrect'}</>
                    ) : (
                      <>
                        {e?.active === 'SUBMITED' ? 'Submitted' : 'Unfinished'}
                      </>
                    )}
                  </td>
                  <td className="p-0 pr-4 text-start m-6 text-gray-1">
                    {e?.question?.qType !== 'ESSAY' && (
                      <div className="flex items-center ml-1">
                        <img
                          src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                          alt="Correct"
                          className="w-4 text-state-success mr-1"
                        />
                        {roundNumber(e?.question?.question_report?.ratio || 0)}%
                      </div>
                    )}
                  </td>
                  <td className="p-0 text-start m-6">
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
          </>
        </SappTable>
      </div>
    </div>
  )
}

export default YourScoreDetail
