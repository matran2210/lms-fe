import SappTable from '@components/base/SappTable'
import { Dispatch } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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
      'text-left pb-3 text-medium-sm text-gray-1 font-semibold min-w-62px',
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
    const res = await fetchScoreDetail(1, 4)
    setScoreDetail(res?.data)
  }

  useEffect(() => {
    getScoreDetail()
  }, [router])

  return (
    <div className="bg-white px-24 py-6 max-w-full max-h-full">
      <div className="">
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
                <tr key={e?.id}>
                  <td className="pr-1">{index + 1}</td>
                  <td className="text-start m-6 pr-4">
                    <div
                      className="text-gray-600 sapp-text-truncate-1"
                      dangerouslySetInnerHTML={{
                        __html: String(e?.question?.question_content),
                      }}
                    ></div>
                  </td>
                  <td className="text-start m-6 pr-4">
                    {e?.question?.question_topic?.name}
                  </td>
                  <td className="text-start m-6 pr-4">
                    <div className="mt-6 mr-6 mb-6">{e?.question?.qType}</div>
                  </td>
                  <td
                    className={`text-start m-6 pr-1
                      ${
                        e?.is_correct
                          ? ' text-state-success'
                          : ' text-state-error'
                      }
                    `}
                  >
                    {e?.is_correct ? 'Correct' : 'Incorrect'}
                  </td>
                  <td className="text-start m-6 text-gray-1 pr-4">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '5px',
                      }}
                    >
                      {e?.result === 'Correct' && (
                        <img
                          src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                          alt="Correct"
                          className="w-4 text-state-success mr-1"
                        />
                      )}
                      {e?.result === 'Incorrect' && (
                        <img
                          src="https://file.rendit.io/n/OiFcovF8STzKyMYRzNk0.svg"
                          alt="Incorrect"
                          className="w-4 text-state-error mr-1"
                        />
                      )}
                      {e?.progress}
                    </div>
                  </td>
                  <td className="text-start m-6 pr-4">
                    <div>
                      {(() => {
                        if (e?.time_spent !== null) {
                          return e?.time_spent
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
