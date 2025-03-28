import LayoutFilter from '@components/layout/Filter/index'
import { Typography } from 'antd'
import SappTable from '@components/table/SappTable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { formatDateFromUTC } from 'src/utils/index'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import NameActionCell from '@components/teacher/components/NameActionCell'
import { TeacherAPI } from '@pages/api/teacher'
import { useQuery } from 'react-query'
import StudentsTestResultFilter from '@components/teacher/components/StudentsTestResultFilter'
import { useForm } from 'react-hook-form'
import { PageLink } from 'src/constants'
import { IStudentTestResult } from 'src/type/classes'

const { Title } = Typography

interface FilterParams {
  text?: string
  grading_method?: string
  quiz_type?: string
}

const initialValues: FilterParams = {
  text: undefined,
  quiz_type: undefined,
  grading_method: undefined,
}

export default function StudentsTestResult() {
  const { control, reset, getValues } = useForm()
  const router = useRouter()
  const studentId = router?.query?.id as string

  const [params, setParams] = useState<FilterParams>(initialValues)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['student', studentId, pagination, params],
    queryFn: () =>
      TeacherAPI.getListTestQuiz(
        studentId,
        pagination.current ?? 1,
        pagination.pageSize ?? 10,
        params,
      ),
    enabled: !!studentId,
  })

  useEffect(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_index: pagination.current,
          page_size: pagination.pageSize,
          ...params,
        },
      },
      undefined,
      { shallow: true },
    )
  }, [pagination, params])

  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }

  const handleResetFilter = () => {
    reset({ text: '', quiz_type: '', grading_method: '' })
    setParams(initialValues)
  }

  const onSubmit = () => {
    setParams({
      text: getValues('text') || undefined,
      quiz_type: getValues('quiz_type')?.value || undefined,
      grading_method: getValues('grading_method')?.value || undefined,
    })
  }

  const columnsValue = [
    {
      title: 'Test name',
      render: (record: IStudentTestResult) => (
        <NameActionCell
          data={record?.quiz?.name ?? ''}
          linkView={`${PageLink.TEACHER_MY_CLASS}/chapter-test?studentId=${studentId}&chapterTestId=${record?.quiz?.id}`}
        />
      ),
      onCell: () => ({
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Type',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell data={record?.quiz?.quiz_type ?? ''} />
      ),
    },
    {
      title: 'Mode',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell data={record?.mode ?? ''} />
      ),
    },
    {
      title: 'Manual Grading',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          data={record?.quiz?.grading_method === 'AUTO' ? 'No' : 'Yes'}
        />
      ),
    },
    {
      title: 'Start time',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          data={
            record?.start_time ? formatDateFromUTC(record?.start_time) : '-'
          }
        />
      ),
    },
    {
      title: 'Đã làm',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell data={record?.total_attempts ?? ''} />
      ),
    },
    {
      title: 'Đã chấm',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          data={`${record?.total_grading_attempts}/${record?.total_attempts}`}
        />
      ),
    },
    {
      title: 'Thời gian chấm',
      render: (record: IStudentTestResult) => (
        <NameNoActionCell
          data={record?.end_time ? formatDateFromUTC(record?.end_time) : '-'}
        />
      ),
    },
  ]

  return (
    <div>
      <LayoutFilter
        listFilter={<StudentsTestResultFilter control={control} />}
        loading={false}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <Title level={5} className="mt-6 text-gray-700">
        Test/Quiz List: {data?.metadata?.total_records ?? 0}
      </Title>
      <SappTable
        handleChangeParams={handleChangeParams}
        filterParams={params}
        fetchData={() => {}}
        fetchTableData={() => {}}
        columns={columnsValue}
        data={data?.class_quizzes ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        showCheckbox={false}
        setSelection={() => {}}
        selections={new Map()}
      />
    </div>
  )
}
