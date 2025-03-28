import LayoutFilter from '@components/layout/Filter/index'
import { Typography } from 'antd'
import SappTable from '@components/table/SappTable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { formatDateFromUTC } from 'src/utils/index'
import StudentCell from '@components/teacher/components/StudentCell'
import { TeacherAPI } from '@pages/api/teacher'
import { useQuery } from 'react-query'
import StudentFilter from '@components/teacher/components/StudentFilter'
import { useForm } from 'react-hook-form'
import { IStudentClassDetail } from 'src/type/classes'

const { Title } = Typography

interface FilterParams {
  text?: string
}

const initialValues: FilterParams = {
  text: '',
}

export default function Students() {
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
      TeacherAPI.getStudentById(
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
    reset(initialValues)
    setParams(initialValues)
  }

  const onSubmit = () => {
    setParams({ text: getValues('text') || undefined })
  }

  const columnsValue = [
    {
      title: 'ID',
      render: (record: IStudentClassDetail) => (
        <StudentCell data={record?.user?.hubspot_contact_id ?? ''} />
      ),
    },
    {
      title: 'Student Name',
      render: (record: IStudentClassDetail) => (
        <StudentCell data={record?.user?.detail?.full_name ?? ''} />
      ),
    },
    {
      title: 'Email',
      render: (record: IStudentClassDetail) => (
        <StudentCell data={record?.user?.user_contacts?.[0]?.email ?? ''} />
      ),
    },
    {
      title: 'Phone',
      render: (record: IStudentClassDetail) => (
        <StudentCell data={record?.user?.user_contacts?.[0]?.phone ?? ''} />
      ),
    },
    {
      title: 'Level',
      render: (record: IStudentClassDetail) => (
        <StudentCell data={record?.user?.detail?.level ?? ''} />
      ),
    },
    {
      title: 'Duration',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          data={`${formatDateFromUTC(record?.started_at ?? '')} - ${formatDateFromUTC(
            record?.updated_at ?? '',
          )}`}
        />
      ),
    },
    {
      title: 'Progress',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          data={`${Math.round(
            ((record?.learning_progress?.total_course_sections_completed ?? 0) /
              (record?.learning_progress?.total_course_sections || 1)) *
              100,
          )}%`}
        />
      ),
    },
    {
      title: 'Exam Date',
      render: (record: IStudentClassDetail) => (
        <StudentCell data={record?.examination_subject ?? ''} />
      ),
    },
  ]

  return (
    <>
      <LayoutFilter
        listFilter={<StudentFilter control={control} />}
        loading={false}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <Title level={5} className="mt-6 text-gray-700">
        Student List: {data?.meta?.total_records ?? 0} Students
      </Title>
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.students ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        showCheckbox={false}
      />
    </>
  )
}
