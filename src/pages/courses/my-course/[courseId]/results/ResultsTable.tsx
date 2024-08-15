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
import { TEST_TYPE } from '@utils/constants'
import { Tooltip } from 'antd'

interface Iprops {
  courseId: string
}

const commonHeaderCellStyle =
  'text-left text-medium-sm text-gray-1 font-semibold pb-3'
const commonDataCellStyle = 'col text-start py-5 pr-4'
const headers = [
  'Name',
  'Belong To',
  'Type',
  'Multiple Choice Score',
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
      <div className="mb-8 flex flex-wrap gap-6 md:flex-nowrap">
        <ResultsTableFilter {...selectFilterProp} />
      </div>
      <SappTable
        headers={headers}
        hasCheck={false}
        isCheckedAll={false}
        classTable="w-full"
        loading={isFetching}
      >
        {resultData?.data?.map((row: any) => {
          const lastSubmission = row?.last_submit_time
            ? dayjs(row?.last_submit_time).format('DD/MM/YYYY hh:mm')
            : '-'

          return (
            <tr
              className={clsx({
                'row h-auto border-b border-dashed border-gray-2': true,
                'text-gray-2': !row.is_studied,
              })}
              key={row?.id}
            >
              {/* Name */}
              <td className={clsx(commonDataCellStyle)}>
                <Tooltip title={row?.name} color="white">
                  {truncateString(row?.name, 30)}
                </Tooltip>
              </td>

              {/* Belong to */}
              <td className={clsx(commonDataCellStyle)}>
                <Tooltip title={row?.path} color="white">
                  {truncateString(row.path, 30)}
                </Tooltip>
              </td>

              {/* Type */}
              <td className={clsx(commonDataCellStyle)}>
                {TEST_TYPE[row?.course_section_type]}
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
              <td className={clsx('!pr-0', commonDataCellStyle)}>
                {lastSubmission}
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
