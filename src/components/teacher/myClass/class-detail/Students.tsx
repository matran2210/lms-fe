import LayoutFilter from '@components/layout/TeacherFilter/index'
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
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { round } from 'lodash'
import { FOUNDATION } from '@utils/constants'
import { DATE_FORMAT } from 'src/constants'

interface FilterParams {
  text?: string
}

const initialValues: FilterParams = {
  text: undefined,
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
    retry: false,
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

  const calculateProgress = (record: IStudentClassDetail): number => {
    const totalSections = record?.learning_progress?.total_course_sections ?? 0
    const completedSections =
      record?.learning_progress?.total_course_sections_completed ?? 0

    return totalSections > 0
      ? round((completedSections / totalSections) * 100, 2)
      : 0
  }
  const handleResetFilter = () => {
    reset(initialValues)
    setParams(initialValues)
  }

  const onSubmit = () => {
    setParams({ text: getValues('text') || undefined })
  }
  useEffect(() => {
    if (data?.meta?.total_records) {
      setPagination((prev) => ({
        ...prev,
        total: data?.meta?.total_records,
      }))
    }
  }, [data])

  const columnsValue = [
    {
      title: '#',
      render: (
        _: IStudentClassDetail,
        record: IStudentClassDetail,
        index: number,
      ) => (
        <NameNoActionCell
          dataColumn={
            index +
            1 +
            ((pagination?.current || 1) - 1) * (pagination?.pageSize || 10)
          }
        />
      ),
    },
    {
      title: 'ID',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell dataColumn={record?.user?.hubspot_contact_id} />
      ),
    },
    {
      title: 'Student Name',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.user?.detail?.full_name} />
      ),
    },
    {
      title: 'Email',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell
          dataColumn={record?.user?.user_contacts?.[0]?.email}
        />
      ),
    },
    {
      title: 'Phone',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell
          dataColumn={record?.user?.user_contacts?.[0]?.phone}
        />
      ),
    },
    {
      title: 'Level',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell dataColumn={record?.user?.detail?.level} />
      ),
    },
    {
      title: 'Duration',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell
          dataColumn={
            record?.flexible_duration &&
            record?.started_at === null &&
            record?.finished_at === null
              ? `${record?.flexible_duration} ${
                  record?.flexible_duration > 1 ? 'days' : 'day'
                }`
              : `${formatDateFromUTC(record?.started_at as string)} - ${formatDateFromUTC(
                  record?.finished_at as string,
                )}`
          }
        />
      ),
    },
    {
      title: 'Progress',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          dataColumn={
            record?.is_passed ? `${calculateProgress(record)}%` : FOUNDATION
          }
        />
      ),
    },
    {
      title: 'Exam Date',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell
          dataColumn={record?.examination_subject?.examination?.name}
        />
      ),
    },
  ]

  return (
    <>
      <LayoutFilter
        listFilter={<StudentFilter control={control} />}
        loading={isLoading}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.students ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        titleTable={{
          title: `Student List: ${data?.meta?.total_records ?? 0} Students`,
          isShowTitle: true,
        }}
      />
    </>
  )
}
