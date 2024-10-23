import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import { GradingMethod, GradingStatus, TEST_TYPE } from '@utils/constants'
import { getTimeFromInput, truncateString } from '@utils/index'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import useSelectFilter from 'src/hooks/useSelectFilter'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { Daum, IResultsList } from 'src/type/results'
import ResultsTableFilter from './ResultsTableFilter'

// Là essay nên không có điểm
const commonHeaderCellStyle =
  'text-left text-medium-sm text-gray-1 font-semibold pb-3 min-w-28'

const commonDataCellStyle = 'col py-5 pr-4 whitespace-nowrap'
const headers = [
  ...['Name', 'Belong To', 'Type'].map((label) => ({
    label,
    className: commonHeaderCellStyle,
  })),
  {
    label: 'Graded Activity',
    className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
  },
  {
    label: 'Status',
    className: clsx(commonHeaderCellStyle),
  },
  {
    label: 'Score',
    className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
  },
  {
    label: 'Time Spent',
    className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
  },
  {
    label: 'Last submission',
    className: commonHeaderCellStyle,
  },
] as {
  label: string
  className: string
}[]

const ResultsTable = () => {
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
  } = useQuery<IResultsList>({
    // Fetch lại data khi filter thay đổi
    queryKey: [CourseKey.ResultsList, currentPage, pageSize, selected],
    queryFn: () => {
      return CoursesAPI.getCourseResults(
        router.query.courseId as string,
        currentPage || 1,
        pageSize,
        params,
      )
    },
    enabled: router.query.courseId !== undefined,
    select: (data: { data: any }) => {
      return data.data
    },
    retry: false,
  })

  const getScore = (rowData: Daum, grading_method: GradingMethod): string => {
    const attempt = rowData.quiz.attempts[0]

    if (!attempt) return '-'

    if (grading_method === GradingMethod.AUTO)
      return `${attempt.multiple_choice_score}%`

    if (
      grading_method === GradingMethod.MANUAL &&
      attempt.grading_status === GradingStatus.FINISHED
    ) {
      return `${attempt.score}%`
    }

    return '-'
  }

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
        {resultData?.data?.map((row) => {
          return (
            <tr
              className={clsx({
                'row h-auto border-b border-dashed border-gray-2': true,
                'text-gray-2':
                  !row?.quiz?.attempts || row?.quiz?.attempts.length === 0,
              })}
              key={row?.id}
            >
              {/* Name */}
              <td className={clsx(commonDataCellStyle)}>
                <Tooltip
                  title={row?.name?.length > 30 && row?.name}
                  color="white"
                >
                  {row?.quiz?.attempts?.[0]?.id ? (
                    <Link
                      href={`/courses/test/test-result/${row?.quiz?.attempts?.[0]?.id}`}
                    >
                      {truncateString(row?.name, 30)}
                    </Link>
                  ) : (
                    truncateString(row?.name, 30)
                  )}
                </Tooltip>
              </td>

              {/* Belong to */}
              <td className={clsx(commonDataCellStyle)}>
                <Tooltip
                  title={row?.path?.length > 30 && row?.path && row.path}
                  color="white"
                >
                  {truncateString(row?.path || '-', 30)}
                </Tooltip>
              </td>

              {/* Type */}
              <td className={clsx(commonDataCellStyle)}>
                {TEST_TYPE[row?.course_section_type]}
              </td>

              {/* Graded Activity */}
              <td className={clsx(commonDataCellStyle, 'text-center')}>
                {row?.quiz?.is_graded ? 'Yes' : 'No'}
              </td>

              {/* Status */}
              <td className={clsx(commonDataCellStyle)}>
                {row?.quiz?.attempts.length > 0
                  ? row?.quiz?.attempts?.[0]?.status
                  : '-'}
              </td>

              {/* Score */}
              <td className={clsx(commonDataCellStyle, 'text-center')}>
                {getScore(row, row?.quiz?.grading_method)}
              </td>

              {/* Time Spent */}
              <td className={clsx(commonDataCellStyle, 'text-center')}>
                {getTimeFromInput(row?.quiz?.attempts[0]?.total_attempt_time)}
              </td>

              {/* Last Submission */}
              <td className={clsx('!pr-0', commonDataCellStyle)}>
                {row.quiz?.attempts.length > 0
                  ? dayjs(row?.quiz?.attempts[0]?.updated_at).format(
                      'DD/MM/YYYY hh:mm',
                    )
                  : '-'}
              </td>
            </tr>
          )
        })}
      </SappTable>
      {resultData && (
        <PaginationSAPP
          currentPage={resultData.metadata?.page_index}
          pageSize={resultData.metadata?.page_size}
          totalItems={resultData.metadata?.total_records}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          type={'table'}
          classname="mt-3"
        />
      )}
    </>
  )
}

export default ResultsTable
