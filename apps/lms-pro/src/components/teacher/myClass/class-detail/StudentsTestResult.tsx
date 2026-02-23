import DateActionCell from '@components/teacher/components/DateActionCell'
import NameActionCell from '@components/teacher/components/NameActionCell'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import StudentsTestResultFilter from '@components/teacher/components/StudentsTestResultFilter'
import { DATE_FORMAT, GradingMethod, IStudentTestResult } from '@lms/core'
import { useSappPaging } from '@lms/hooks'
import { LayoutFilter, SappTable } from '@lms/ui'
import { formatDateFromUTC } from '@lms/utils'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StudentKey } from 'src/api/queryKey'
import { TeacherAPI } from 'src/api/teacher'
import { PageLink } from 'src/constants/routers'

interface FilterParams {
  quiz_name?: string
  grading_method?: string
  quiz_type?: string
}

const initialValues: FilterParams = {
  quiz_name: undefined,
  quiz_type: undefined,
  grading_method: undefined,
}

export default function StudentsTestResult() {
  const { control, reset, getValues } = useForm()
  const param = useParams();
  const { id } = param
  const studentId = id as string
  const [params, setParams] = useState<FilterParams>(initialValues)

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: StudentKey.StudentsTestResult,
      queryFn: () =>
        TeacherAPI.getListTestQuiz(
          studentId,
          pagination.current ?? 1,
          pagination.pageSize ?? 10,
          params,
        ),
      params,
    })

  const handleResetFilter = () => {
    reset({ quiz_name: '', quiz_type: '', grading_method: '' })
    setParams(initialValues)
  }

  const onSubmit = () => {
    setParams({
      quiz_name: getValues('quiz_name') || undefined,
      quiz_type: getValues('quiz_type')?.value || undefined,
      grading_method: getValues('grading_method')?.value || undefined,
    })
  }

  const columnsValue = [
    {
      title: 'Test name',
      render: (record: IStudentTestResult) => (
        <NameActionCell
          dataColumn={record?.quiz?.name}
          linkView={`${PageLink.TEACHER_CHAPTER_TEST}?studentId=${studentId}&chapterTestId=${record?.quiz?.id}&manualGrading=${record?.quiz?.grading_method === GradingMethod.MANUAL}`}
        />
      ),
      onCell: () => ({
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Type',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell dataColumn={record?.quiz?.quiz_type} />
      ),
    },
    {
      title: 'Mode',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell dataColumn={record?.mode} />
      ),
    },
    {
      title: 'Manual Grading',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          dataColumn={
            record?.quiz?.grading_method === GradingMethod.AUTO ? 'No' : 'Yes'
          }
        />
      ),
    },
    {
      title: 'Access Period',
      render: (record: IStudentTestResult) => (
        <DateActionCell
          dataColumn={{
            startTime: record?.start_time as string,
            endTime: record?.end_time as string,
          }}
        />
      ),
    },
    {
      title: 'Đã làm',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell dataColumn={record?.total_attempts} />
      ),
    },
    {
      title: 'Đã chấm',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          dataColumn={`${
            record.quiz?.grading_method === GradingMethod.MANUAL
              ? `${record?.total_grading_attempts}/${record?.total_attempts}`
              : '--'
          }`}
        />
      ),
    },
    {
      title: 'Thời gian chấm',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          dataColumn={formatDateFromUTC(
            record?.quiz?.due_date_grade as string,
            DATE_FORMAT.DATE_TIME,
          )}
        />
      ),
    },
  ]

  return (
    <div>
      <LayoutFilter
        listFilter={<StudentsTestResultFilter control={control} />}
        loading={isLoading}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.class_quizzes ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        titleTable={{
          title: `Test/Quiz List: ${data?.metadata?.total_records ?? 0}`,
          isShowTitle: true,
        }}
        isShowIndex
      />
    </div>
  )
}
