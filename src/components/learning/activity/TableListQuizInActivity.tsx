import { QuizActivity } from 'src/type/results'
import { ColumnsType } from 'antd/es/table'
import SappTable from '@components/table/SappTable'
import { StatusQuizTag } from '@components/teacher/components/StatusActionCell'
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'
import { getTimeFromInput } from '@utils/index'
import dayjs from 'dayjs'

const TableListQuizInActivity = ({
  activity,
}: {
  activity: QuizActivity[]
}) => {
  const columnsValue: ColumnsType<QuizActivity> = [
    {
      title: 'Type',
      render: (record) => <div>{record?.quiz_type}</div>,
    },
    {
      title: 'Graded Activity',
      render: (record) => <div> {record?.is_graded ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Status',
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
      render: (record) => <div>{record?.required_percent_score}</div>,
    },
    {
      title: 'Time Spent',
      render: (record) => (
        <div>{getTimeFromInput(record?.attempts?.[0]?.total_attempt_time)}</div>
      ),
    },
    {
      title: 'Last submission',
      render: (record) => (
        <div>
          {record?.attempts?.length > 0
            ? dayjs(record?.attempts[0]?.updated_at).format('DD/MM/YYYY HH:mm')
            : '-'}
        </div>
      ),
    },
  ]

  return (
    <SappTable
      columns={columnsValue}
      data={activity ?? []}
      pagination={{
        current: 1,
        pageSize: activity?.length,
        total: activity?.length,
      }}
      loading={false}
      isShowIndex
      isShowPagination={false}
    />
  )
}

export default TableListQuizInActivity
