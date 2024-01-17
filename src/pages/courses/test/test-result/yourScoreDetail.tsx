import SappTable from '@components/base/SappTable'
import { Dispatch } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { roundNumber, convertSecondsToMinutesSeconds } from '@utils/helpers'
import { QUESTION_TYPES } from 'src/constants'

const headers = [
  {
    label: '#',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-62px',
  },
  {
    label: 'Question',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[210px]',
  },
  {
    label: 'Topic',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[210px]',
  },
  {
    label: 'Type',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold  min-w-[117px]',
  },
  {
    label: 'Result',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold  min-w-[70px]',
  },
  {
    label: '',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[117px]',
  },
  {
    label: 'Time Spent',
    className:
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-[95px]',
  },
]

const YourScoreDetail = () => {
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
        return 'True False'
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
    <div className="bg-white px-6 xl:px-24 py-6 max-w-[1144px] max-h-full shadow-sidebar">
      <div className="text-xl font-medium text-bw-1 mb-6">
        Your Score Details
      </div>
      <div className="block pl-4">
        <SappTable
          headers={headers}
          loading={true}
          data={scoreDetail?.answers}
          isCheckedAll={true}
          onChange={() => {}}
          hasCheck={false}
        >
          <>
            {scoreDetail.answers?.map((e: any, index: number) => {
              return (
                <tr
                  className="border-dashed border-b border-gray-2"
                  key={e?.id}
                >
                  <td className="pr-1 text-bw-1">{index + 1}</td>
                  <td className="text-start m-6 pr-4">
                    <div
                      className="text-bw-1 sapp-text-truncate-1 cursor-pointer hover:font-semibold"
                      dangerouslySetInnerHTML={{
                        __html: String(e?.question?.question_content ?? '--'),
                      }}
                      onClick={() => {
                        router.push(
                          `/entrance-test/table-result/explanation/${e.id}`,
                        )
                      }}
                    ></div>
                  </td>
                  <td className="text-start m-6 pr-4 text-bw-1">
                    {e?.question?.question_topic?.name ?? '--'}
                  </td>
                  <td className="text-start m-6 pr-4 text-bw-1">
                    <div className="mt-6 mr-6 mb-6 min-w-132px">
                      {getTypeName(e?.question?.qType ?? '--')}
                    </div>
                  </td>
                  <td
                    className={`text-start m-6 pr-1
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
                  <td className="text-start m-6 text-gray-1 pr-4">
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
                  <td className="text-start m-6 pr-4">
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
