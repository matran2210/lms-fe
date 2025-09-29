import { QuizActivity, Results } from 'src/type/results'
import { ColumnsType } from 'antd/es/table'
import { Tooltip } from 'antd'
import SappTable from '@components/table/SappTable'
import { StatusQuizTag } from '@components/teacher/components/StatusActionCell'
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'
import { getTimeFromInput } from '@utils/index'
import dayjs from 'dayjs'
import { EDateTime } from 'src/type'
import { GradingMethod } from '@utils/constants'

const TableListQuizInActivity = ({
  data,
  handleViewActivity,
  getScore,
}: {
  data: Results[]
  handleViewActivity: () => void
  getScore: (row: Results, grading_method: GradingMethod) => string
}) => {
  const truncateText = (text: string, maxLength = 30) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  const columnsValue: ColumnsType<QuizActivity> = [
    {
      title: 'Type',
      align: 'center',
      render: (record) => <div>Quiz</div>,
    },
    {
      title: 'Graded Activity',
      align: 'center',
      render: (record) => <div> {record?.is_graded ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Status',
      align: 'center',
      className: 'column-center',
      render: (record) => (
        <StatusQuizTag
          status={
            (record?.attempts?.[0]?.status || 'UN_SUBMITTED') as
              | QUIZ_ATTEMPT_GRADING_STATUS
              | QUIZ_ATTEMPT_STATUS
          }
        />
      ),
    },
    {
      title: 'Score',
      align: 'center',
      render: (record) => <div>100</div>,
    },
    {
      title: 'Path',
      align: 'center',
      render: (record) =>
        (() => {
          const fullText =
            'Topic 6: FIXED INCOME/Learning module 4: Credit Analysis Models/Unit 2: Credit Scores and Credit Ratings/Activity 2: Credit Scores and Credit Ratings'
          return (
            <Tooltip title={fullText}>
              <div>{truncateText(fullText)}</div>
            </Tooltip>
          )
        })(),
    },
    {
      title: 'Time Spent',
      align: 'center',
      render: (record) => <div>{getTimeFromInput(130)}</div>,
    },
    {
      title: 'Last Submission',
      align: 'center',
      render: (record) => (
        <div>
          {1 > 0
            ? dayjs('2025-09-29T03:00:00Z').format(EDateTime.fullDate)
            : '-'}
        </div>
      ),
    },
  ]

  return (
    <SappTable
      columns={columnsValue}
      data={data ?? []}
      pagination={{
        current: 1,
        pageSize: data?.length,
        total: data?.length,
      }}
      loading={false}
      isShowIndex
      isShowPagination={false}
      onRow={() => ({
        onClick: () => handleViewActivity(),
      })}
      className="style-table-quiz cursor-pointer"
    />
  )
}

export default TableListQuizInActivity
