import LayoutFilter from '@components/layout/TeacherFilter/index'
import {SappTable} from '@lms/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { formatDateFromUTC } from 'src/utils/index'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import NameActionCell from '@components/teacher/components/NameActionCell'
import { TeacherAPI } from '@pages/api/teacher'
import StudentsTestResultFilter from '@components/teacher/components/StudentsTestResultFilter'
import { useForm } from 'react-hook-form'
import { DATE_FORMAT, PageLink } from '@lms/core'
import { IStudentTestResult } from '@lms/core'
import { GradingMethod } from '@lms/core'
import { StudentKey } from '@pages/api/queryKey'
import useSappPaging from 'src/hooks/useSappPaging'
import DateActionCell from '@components/teacher/components/DateActionCell'

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
  const router = useRouter()
  const studentId = router?.query?.id as string
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
