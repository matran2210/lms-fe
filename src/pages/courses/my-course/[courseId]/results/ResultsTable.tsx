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
import { useState } from 'react'
import { useQuery } from 'react-query'
import { GRADE_STATUS } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { IResultsList, QuizActivity, Results } from 'src/type/results'
import ResultQuizModal from './ResultQuizModal'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { ConfirmIcon } from '@assets/icons'
import { TEST_TYPE } from 'src/constants'
import Tooltip from 'src/common/Tooltip'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import CollapseActivity from '@components/learning/activity/CollapseActivity'
import { isEmpty } from 'lodash'
import CardResultTest from '@components/learning/activity/CardResultTest'

const commonDataCellStyle = 'col py-5 pr-4 whitespace-nowrap'

// Là essay nên không có điểm
const commonHeaderCellStyle =
  'text-left text-sm text-[#A1A1A1] font-semibold pb-3 min-w-28'

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
  const [params, setParams] = useState<any>({})

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
    queryKey: [CourseKey.ResultsList, currentPage, pageSize, params],
    queryFn: () => {
      return CoursesAPI.getCourseResults(
        router.query.courseId as string,
        currentPage || 1,
        pageSize,
        params && {
          parent_id: params,
        },
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

  const getNameTooltipContent = (row: Results, link: string) => {
    return (
      <div>
        {true ? (
          <div
            onClick={() => {
              router.push(link)
            }}
          >
            <strong className="cursor-pointer text-base text-[#050505] hover:underline">
              {row?.name}
            </strong>
          </div>
        ) : (
          <strong className="text-base text-[#050505]">{row?.name}</strong>
        )}
        <p className="text-xs text-[#A1A1A1]">{row?.path}</p>
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
  const handleGetDataActivity = ({ type }: { type: string }) => {
    return (
      resultData?.data
        ?.filter((item) => item.course_section_type === type)
        .map((item) => ({
          activityName: item?.name,
          listQuiz: item?.quiz_activity || [],
          quiz: item?.quiz || {},
          activityId: item?.id,
          courseSectionPath: item?.path,
        })) || []
    )
  }
  const dataActivity = handleGetDataActivity({ type: TEST_TYPE.ACTIVITY })
  const dataMidTermTest = handleGetDataActivity({
    type: TEST_TYPE.MID_TERM_TEST,
  })
  const dataFinalTest = handleGetDataActivity({ type: TEST_TYPE.FINAL_TEST })
  const dataChapterTest = handleGetDataActivity({
    type: TEST_TYPE.CHAPTER_TEST,
  })
  const dataPartTest = handleGetDataActivity({ type: TEST_TYPE.PART_TEST })

  return (
    <>
      <div className="my-6">
        <FilterCourseSection setParams={setParams} />
      </div>
      <div className="flex flex-col gap-6">
        {!isEmpty(dataActivity) && (
          <div className="flex flex-col gap-6">
            {dataActivity?.map((item) => (
              <CollapseActivity
                activity={item?.listQuiz}
                key={item?.activityId}
                activityName={item?.activityName}
                courseSectionPath={item?.courseSectionPath}
              />
            ))}
          </div>
        )}
        {!isEmpty(dataPartTest) && (
          <div className="flex flex-col gap-6">
            {dataPartTest?.map((item) => (
              <CardResultTest
                quiz={item?.quiz}
                key={item?.activityId}
                activityName={item?.activityName}
              />
            ))}
          </div>
        )}
        {!isEmpty(dataMidTermTest) && (
          <div className="flex flex-col gap-6">
            {dataMidTermTest?.map((item) => (
              <CardResultTest
                quiz={item?.quiz}
                key={item?.activityId}
                activityName={item?.activityName}
              />
            ))}
          </div>
        )}
        {!isEmpty(dataChapterTest) && (
          <div className="flex flex-col gap-6">
            {dataChapterTest?.map((item) => (
              <CardResultTest
                quiz={item?.quiz}
                key={item?.activityId}
                activityName={item?.activityName}
              />
            ))}
          </div>
        )}
        {!isEmpty(dataFinalTest) && (
          <div className="flex flex-col gap-6">
            {dataFinalTest?.map((item) => (
              <CardResultTest
                quiz={item?.quiz}
                key={item?.activityId}
                activityName={item?.activityName}
              />
            ))}
          </div>
        )}
      </div>

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
