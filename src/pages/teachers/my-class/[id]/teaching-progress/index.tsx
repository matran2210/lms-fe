import LayoutFilter from '@components/layout/Filter/index'
import SappTable from '@components/table/SappTable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { formatDateFromUTC } from 'src/utils/index'
import StudentCell from 'src/pages/teachers/my-class/components/StudentCell'
import ClassDetail from 'src/pages/teachers/my-class/components/ClassDetail'
import { TeacherAPI } from '@pages/api/teacher'
import { useQuery } from 'react-query'
import { useForm } from 'react-hook-form'
import TeachingProgressFilter from 'src/pages/teachers/my-class/components/TeachingProgressFilter'
import ButtonIconSapp from '@components/base/button/ButtonIconSapp'
import TeachingProgressAction from 'src/pages/teachers/my-class/components/TeachingProgressAction'

interface IStudentData {
  id: string
  name: string
  email: string
  phone: string
  level: string
  duration: string
  progress: string
  examDate: string
}

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
  const Action = (type: string) => {
    if (type === 'attendance-history') {
      // setOpenDrawerAttendanceHistory(true)
    }
  }
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
      title: 'ID',
      render: (record: IStudentData) => <StudentCell data={record?.id ?? ''} />,
    },
    {
      title: 'Student Name',
      render: (record: IStudentData) => (
        <StudentCell data={record?.name ?? ''} />
      ),
    },
    {
      title: 'Email',
      render: (record: IStudentData) => (
        <StudentCell data={record?.email ?? ''} />
      ),
    },
    {
      title: 'Phone',
      render: (record: IStudentData) => (
        <StudentCell data={record?.phone ?? ''} />
      ),
    },
    {
      title: 'Level',
      render: (record: IStudentData) => (
        <StudentCell data={record?.level ?? ''} />
      ),
    },
    {
      title: 'Duration',
      render: (record: IStudentData) => (
        <StudentCell data={record?.duration ?? ''} />
      ),
    },
    {
      title: 'Progress',
      render: (record: IStudentData) => (
        <StudentCell data={record?.progress ?? ''} />
      ),
    },
    {
      title: 'Exam Date',
      render: (record: IStudentData) => (
        <StudentCell data={record?.examDate ?? ''} />
      ),
    },
    {
      title: '',
      fixed: 'right',
      render: (record: any) => (
        <>
          <TeachingProgressAction Action={Action} />
        </>
      ),
    },
  ]

  return (
    <ClassDetail>
      <LayoutFilter
        listFilter={<TeachingProgressFilter control={control} />}
        loading={false}
        onReset={() => {}}
        onSubmit={() => {}}
        layoutAction={
          <ButtonIconSapp
            title="Add Progress"
            icon="plus"
            variant="primary"
            onClick={() => {}}
          />
        }
      />
      <SappTable
        handleChangeParams={() => {}}
        filterParams={params}
        columns={columnsValue}
        fetchData={() => {}}
        data={[]}
        pagination={pagination}
        setPagination={() => {}}
        fetchTableData={() => {}}
        loading={false}
        showCheckbox={false}
        setSelection={() => {}}
        selections={new Map()}
      />
    </ClassDetail>
  )
}
