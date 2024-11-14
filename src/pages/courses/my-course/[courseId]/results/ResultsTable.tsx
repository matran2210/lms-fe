import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import { GradingMethod, GradingStatus, TEST_TYPE } from '@utils/constants'
import { getTimeFromInput, truncateString } from '@utils/index'
import { Modal, Tooltip } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import useSelectFilter from 'src/hooks/useSelectFilter'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { IResultsList, QuizActivity, Results } from 'src/type/results'
import headers from './headers'
import ResultQuizModal from './ResultQuizModal'
import ResultsTableFilter from './ResultsTableFilter'

const commonDataCellStyle = 'col py-5 pr-4 whitespace-nowrap'

const ResultsTable = () => {
  const router = useRouter()
  const [quizActivities, setQuizActivities] = useState<
    QuizActivity[] | undefined
  >(undefined)
  const [openModal, setOpenModal] = useState(false)
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
    retry: 1,
  })

  const getScore = (
    rowData: Results,
    grading_method: GradingMethod,
  ): string => {
    const attempt = rowData?.quiz?.attempts[0]

    if (!attempt) return '-'

    if (grading_method === GradingMethod.AUTO)
      return `${attempt?.multiple_choice_score}%`

    if (
      grading_method === GradingMethod.MANUAL &&
      attempt?.grading_status === GradingStatus.FINISHED
    ) {
      return `${attempt?.score}%`
    }

    return '-'
  }

  const getNameTooltipContent = (row: Results) => {
    return (
      <div>
        {true ? (
          <Link
            href={`/courses/test/test-result/${row?.quiz?.attempts?.[0]?.id}`}
          >
            <strong className="cursor-pointer text-base text-bw-1 hover:underline">
              {row?.name}
            </strong>
          </Link>
        ) : (
          <strong className="text-base text-bw-1">{row?.name}</strong>
        )}
        <p className="text-ssm text-gray-1">{row?.path}</p>
      </div>
    )
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
                  title={getNameTooltipContent(row)}
                  color="white"
                  arrow={false}
                  placement="topLeft"
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
              {/* Quizzes/Tests */}
              <td className={clsx('!pr-0', commonDataCellStyle)}>
                {row.quiz_activity && row?.quiz_activity.length >= 0 ? (
                  <span
                    onClick={() => {
                      if (row?.quiz_activity.length > 0) {
                        setOpenModal(true)
                        setQuizActivities(row.quiz_activity)
                      }
                    }}
                    className={clsx(
                      row?.quiz_activity.length > 0 &&
                        `cursor-pointer text-state-info underline`,
                    )}
                  >
                    {row.quiz_activity.length}
                  </span>
                ) : (
                  <span>-</span>
                )}
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
      <Modal
        open={openModal}
        centered
        onOk={() => {
          setOpenModal(false)
        }}
        title="List Quiz of Activity"
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={800}
        styles={{
          content: {
            padding: 32,
          },
        }}
      >
        {quizActivities && <ResultQuizModal quizActivities={quizActivities} />}
      </Modal>
    </>
  )
}

export default ResultsTable
