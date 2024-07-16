import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import { truncateString } from '@utils/index'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { CoursesAPI } from 'src/pages/api/courses'

const ResultsTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const router = useRouter()

  /**
   * @description config params khi filter
   */
  const params = {
    parentId: router.query.parentId || undefined,
  }

  /**
   * @description fetch API course result
   */
  const fetchCourseResults = async ({
    pageIndex,
    params,
  }: {
    pageIndex: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.getCourseResults(
      '46448b5f-0f76-4031-83ff-fb3060dce02e',
      pageIndex || 1,
      pageSize,
      params,
    )
    return data
  }

  /**
   * @description sử dụng react-query để lấy data sau khi call API
   */
  const {
    data: resultData,
    isFetching,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['courseResults'],
    queryFn: () => {
      return fetchCourseResults({ pageIndex: currentPage, params })
    },
    enabled: router.query.courseId !== undefined,
  })

  const headers = [
    {
      label: 'Name',
      className:
        'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-1/4',
    },
    {
      label: 'Belong To',
      className:
        'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-1/4',
    },
    {
      label: 'Type',
      className:
        'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-1/8',
    },
    {
      label: 'Grade',
      className:
        'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-1/16',
    },
    {
      label: 'Time Spent',
      className:
        'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-1/16',
    },
    {
      label: 'Last submission',
      className:
        'text-left pb-3 text-medium-sm text-gray-1 font-semibold w-1/8',
    },
  ]

  useEffect(() => {
    refetch()
  }, [pageSize, currentPage])

  isLoading && <></>

  return (
    <>
      <SappTable headers={headers} hasCheck={false} isCheckedAll={false}>
        {isSuccess &&
          resultData.data?.map((row: any, index: number) => {
            let parts = []
            let totalScore = 0
            if (row.attempts.length > 0) {
              parts = row?.attempts[0]?.ratio_score.split('/')
              totalScore = (row?.attempts[0].score / parts[0]) * parts[1]
            }
            return (
              <tr
                className="border-dashed border-b border-gray-2 px-5 h-12 wf"
                key={row?.id}
              >
                {/* Name */}
                <td className="px-0 pr-4 text-start py-5">
                  {truncateString(row?.name, 35)}
                </td>

                {/* Belong to */}
                <td className="px-0 pr-4 text-start py-5"></td>

                {/* Type */}
                <td className="px-0 pr-4 text-start py-5">
                  {row?.quiz_type.toLowerCase()}
                </td>

                {/* Grade */}
                <td className="px-0 pr-4 text-start py-5">
                  {row?.attempts[0]?.score
                    ? `${row?.attempts[0]?.score} / ${totalScore}`
                    : ''}
                </td>

                {/* Time Spent */}
                <td className="px-0 pr-4 text-start py-5">
                  {/* {row.attempts} */}
                </td>

                {/* Last Submission */}
                <td className="px-0 pr-4 text-start py-5">
                  {row?.attempts[0]?.finished_at}
                </td>
              </tr>
            )
          })}
      </SappTable>
      <PaginationSAPP
        currentPage={resultData?.metadata?.page_index}
        pageSize={resultData?.metadata?.page_size}
        totalItems={resultData?.metadata?.total_records}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        type={'table'}
        classname="mt-3"
      />
    </>
  )
}

export default ResultsTable
