import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import { getTimeFromInput, truncateString } from '@utils/index'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import useSelectFilter from 'src/hooks/useSelectFilter'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import ResultsTableFilter from './ResultsTableFilter'

interface Iprops {
  courseId: string
}

const commonDataCellStyle = 'text-start py-5'
const commonHeaderCellStyle =
  'text-left text-medium-sm text-gray-1 font-semibold pb-3'
const headers = [
  'Name',
  'Belong To',
  'Type',
  'Grade',
  'Time Spent',
  'Last submission',
].map((label) => ({ label, className: commonHeaderCellStyle }))

const ResultsTable = ({ courseId }: Iprops) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  /**
   * Filter
   */
  const selectFilterProp = useSelectFilter(router.query.courseId)
  const { selected } = selectFilterProp
  /**
   * @description config params khi filter
   */
  const params = {
    parent_id: selected?.value || undefined,
  }

  /**
   * @description sử dụng react-query để lấy data
   */
  const {
    data: resultData,
    isLoading,
    isSuccess,
    refetch,
    isFetching,
  } = useQuery({
    // Fetch lại data khi filter thay đổi
    queryKey: [CourseKey.ResultsList, currentPage, pageSize, selected],
    queryFn: () => {
      return CoursesAPI.getCourseResults(
        courseId,
        currentPage || 1,
        pageSize,
        params,
      )
    },
    enabled: courseId !== undefined,
    select: (data: { data: any }) => {
      return data.data
    },
  })

  isLoading && <></>
  useEffect(() => {
    refetch()
  }, [selected])

  return (
    <>
      <div className="mb-8 flex gap-6">
        <ResultsTableFilter {...selectFilterProp} />
      </div>
      <SappTable
        headers={headers}
        hasCheck={false}
        isCheckedAll={false}
        classTable="table-auto w-full"
        loading={isFetching}
      >
        {resultData?.data?.map((row: any) => {
          const lastSubmission = dayjs(row?.last_submit_time).format(
            'DD/MM/YYYY hh:mm',
          )

          return (
            <tr
              className={clsx({
                'h-auto border-b border-dashed border-gray-2': true,
                'text-gray-2': !row.is_studied,
              })}
              key={row?.id}
            >
              {/* Name */}
              <td className={clsx(commonDataCellStyle)}>
                {truncateString(row?.name, 35)}
              </td>

              {/* Belong to */}
              <td className={clsx(commonDataCellStyle)}>{row.path}</td>

              {/* Type */}
              <td className={clsx(commonDataCellStyle)}>
                {row?.course_section_type.toLowerCase()}
              </td>

              {/* Grade */}
              <td className={clsx(commonDataCellStyle)}>
                {row.score_percentage}
              </td>

              {/* Time Spent */}
              <td className={clsx(commonDataCellStyle)}>
                {row.total_attempt_time
                  ? getTimeFromInput(row.total_attempt_time)
                  : '-'}
              </td>

              {/* Last Submission */}
              <td className={clsx(commonDataCellStyle)}>{lastSubmission}</td>
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
