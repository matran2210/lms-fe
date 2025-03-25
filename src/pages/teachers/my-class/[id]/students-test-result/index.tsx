import LayoutFilter from '@components/layout/Filter/index'
import { Typography } from 'antd'
import SappTable from '@components/table/SappTable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { formatDateFromUTC } from 'src/utils/index'
import StudentCell from 'src/pages/teachers/my-class/components/StudentCell'
import ClassDetail from 'src/pages/teachers/my-class/components/ClassDetail'
import { TeacherAPI } from '@pages/api/teacher'
import { useQuery } from 'react-query'
import StudentFilter from 'src/pages/teachers/my-class/components/StudentFilter'
import { useForm } from 'react-hook-form'

const { Title } = Typography

interface FilterParams {
  text?: string
}

const initialValues: FilterParams = {
  text: '',
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
  }, [pagination, params, router])

  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }

  const handleResetFilter = () => {
    reset(initialValues)
    setParams(initialValues)
  }

  const onSubmit = () => {
    setParams({ text: getValues('text') || undefined })
  }

  const columnsValue = [
    {
      title: 'Test name',
      render: (record: any) => <StudentCell data={record?.quiz?.name ?? ''} />,
    },
    {
      title: 'Type',
      render: (record: any) => (
        <StudentCell data={record?.quiz?.quiz_type ?? ''} />
      ),
    },
    {
      title: 'Mode',
      render: (record: any) => <StudentCell data={record?.mode ?? ''} />,
    },
    {
      title: 'Manual Grading',
      render: (record: any) => (
        <StudentCell data={record?.total_grading_attempts ?? ''} />
      ),
    },
    {
      title: 'Start time',
      render: (record: any) => (
        <StudentCell data={formatDateFromUTC(record?.quiz?.created_at) ?? ''} />
      ),
    },
    {
      title: 'Đã làm',
      render: (record: any) => (
        <StudentCell data={record?.total_attempts ?? ''} />
      ),
    },
    {
      title: 'Đã chấm',
      render: (record: any) => (
        <StudentCell
          data={`${record?.total_grading_attempts}/${record?.total_attempts}`}
        />
      ),
    },
    {
      title: 'Thời gian chấm',
      render: (record: any) => (
        <StudentCell data={formatDateFromUTC(record?.quiz?.created_at) ?? ''} />
      ),
    },
  ]

  return (
    <ClassDetail>
      <LayoutFilter
        listFilter={<StudentFilter control={control} />}
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
    </ClassDetail>
  )
}
