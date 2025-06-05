import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import SappTable from '@components/base/SappTable'
import { GradingMethod, TEST_TYPE as testTypeTitle } from '@utils/constants'
import {
  capitalizeFirstLetter,
  getTimeFromInput,
  truncateString,
} from '@utils/index'
import { Modal } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GRADE_STATUS } from 'src/constants'
import useSelectFilter from 'src/hooks/useSelectFilter'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { IResultsList, QuizActivity, Results } from 'src/type/results'
import ResultQuizModal from './ResultQuizModal'
import ResultsTableFilter from './ResultsTableFilter'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { ConfirmIcon } from '@assets/icons'
import { TEST_TYPE } from 'src/constants'
import Tooltip from 'src/common/Tooltip'

const commonDataCellStyle = 'col py-5 pr-4 whitespace-nowrap'

// Là essay nên không có điểm
const commonHeaderCellStyle =
  'text-left text-sm text-gray-1 font-semibold pb-3 min-w-28'

export const headers = [
  ...['Name', 'Type'].map((label) => ({
    label,
    className: commonHeaderCellStyle,
  })),
  {
    label: 'Graded Activity',
    className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
  },
  {
    label: 'Status',
    className: clsx(commonHeaderCellStyle, 'capitalize'),
  },
  {
    label: 'Score',
    className: clsx(commonHeaderCellStyle, 'text-center'),
  },
  {
    label: 'Quizzes/Tests',
    className: commonHeaderCellStyle,
  },
  {
    label: 'Time Spent',
    className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
  },
  {
    label: 'Last submission',
    className: clsx(commonHeaderCellStyle, 'min-w-40 text-center'),
  },
] as {
  label: string
  className: string
}[]

const ResultsTable = () => {
  const router = useRouter()
  const [quizActivities, setQuizActivities] = useState<
    QuizActivity[] | undefined
  >(undefined)
  const [openModal, setOpenModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [openReport, setOpenReport] = useState<boolean>(false)

  /**
   * Filter
   */
  const selectFilterProp = useSelectFilter(router?.query?.courseId)
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
      attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING
    ) {
      return `${attempt?.score}%`
    }
    return '-'
  }

  const getStatus = (row: Results) => {
    if (row?.course_section_type === TEST_TYPE.ACTIVITY) {
      for (const quiz of row?.quiz_activity) {
        if (
          quiz?.attempts?.length === 0 ||
          (!quiz?.attempts?.[0].grading_status &&
            quiz?.grading_method === GradingMethod.MANUAL) ||
          (quiz?.grading_method === GradingMethod.AUTO &&
            quiz?.attempts?.[0].status !== 'SUBMITTED')
        )
          return '-'
      }
      return 'Submitted'
    } else {
      if (row?.quiz?.grading_method === GradingMethod.MANUAL) {
        switch (row?.quiz?.attempts?.[0]?.grading_status) {
          case GRADE_STATUS.AWAITING_GRADING:
            return 'Awaiting Grading'
          case GRADE_STATUS.FINISHED_GRADING:
            return 'Finish Grading'
          default:
            return 'Manual Grading'
        }
      }
      return capitalizeFirstLetter(
        row?.quiz?.attempts?.[0]?.status?.toLocaleLowerCase(),
      )
    }
  }

  const getNameTooltipContent = (row: Results, link: string) => {
    return (
      <div>
        {true ? (
          <div
            onClick={() => {
              router.push(link)
            }}
          >
            <strong className="cursor-pointer text-base text-bw-1 hover:underline">
              {row?.name}
            </strong>
          </div>
        ) : (
          <strong className="text-base text-bw-1">{row?.name}</strong>
        )}
        <p className="text-xs text-gray-1">{row?.path}</p>
      </div>
    )
  }

  const isDoneQuiz = (data: Results) => {
    switch (data?.course_section_type) {
      case TEST_TYPE.ACTIVITY: {
        if (!data?.quiz_activity?.length) {
          return
        }
        for (const item of data?.quiz_activity) {
          if (item?.attempts?.length === 0) {
            return false
          }
        }
        return true
      }
      case TEST_TYPE.TOPIC_TEST:
      case TEST_TYPE.CHAPTER_TEST:
      case TEST_TYPE.MID_TERM_TEST:
      case TEST_TYPE.PART_TEST:
      case TEST_TYPE.FINAL_TEST:
        return !data?.quiz
          ? false
          : data?.quiz?.attempts?.length > 0
            ? true
            : false
      default:
        return true
    }
  }

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
          let link: string = '#'
          if (row.course_section_type === TEST_TYPE.ACTIVITY) {
            link = `/courses/${router?.query?.courseId}/activity/${row?.id}`
          } else {
            if (row?.quiz?.attempts?.length) {
              link = `/courses/test/test-result/${row?.quiz?.attempts?.[0]?.id}`
            } else {
              link = `/test/${row?.quiz?.id}?class_user_id=${resultData?.class_user_id}`
            }
          }
          return (
            <tr
              className={clsx({
                'row h-auto border-b border-dashed border-gray-2': true,
                'text-gray-2': !isDoneQuiz(row),
              })}
              key={row?.id}
            >
              {/* Name */}
              <td className={clsx(commonDataCellStyle)}>
                <Tooltip
                  title={getNameTooltipContent(row, link)}
                  arrow={false}
                  placement="topLeft"
                >
                  <div
                    onClick={() => {
                      if (
                        row?.course_section_type !== TEST_TYPE.ACTIVITY &&
                        row?.quiz?.grading_method === 'MANUAL' &&
                        row?.quiz?.attempts?.[0]?.grading_status ===
                          GRADE_STATUS.AWAITING_GRADING
                      ) {
                        setOpenReport(true)
                        return
                      }
                      router.push(link)
                    }}
                    className="cursor-pointer"
                  >
                    {truncateString(row?.name, 30)}
                  </div>
                </Tooltip>
              </td>

              {/* Type */}
              <td className={clsx(commonDataCellStyle)}>
                {testTypeTitle[row?.course_section_type]}
              </td>

              {/* Graded Activity */}
              <td className={clsx(commonDataCellStyle, 'text-center')}>
                {row?.quiz?.is_graded ? 'Yes' : 'No'}
              </td>

              {/* Status */}
              <td className={clsx(commonDataCellStyle)}>{getStatus(row)}</td>

              {/* Score */}
              <td className={clsx(commonDataCellStyle, 'text-center')}>
                {getScore(row, row?.quiz?.grading_method)}
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

              {/* Time Spent */}
              <td className={clsx(commonDataCellStyle, 'text-center')}>
                {getTimeFromInput(row?.quiz?.attempts[0]?.total_attempt_time)}
              </td>

              {/* Last Submission */}
              <td className={clsx('!pr-0', commonDataCellStyle)}>
                {row.quiz?.attempts?.length > 0
                  ? dayjs(row?.quiz?.attempts[0]?.updated_at).format(
                      'DD/MM/YYYY HH:mm',
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
      <SappModalV3
        open={openReport}
        okButtonCaption="Back"
        handleCancel={() => {}}
        onOk={() => setOpenReport(false)}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<ConfirmIcon />}
        header="Awating Grading"
        content={`Your test is currently being graded. The result will be sent to you via email as soon as the grading is complete.`}
      />
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
