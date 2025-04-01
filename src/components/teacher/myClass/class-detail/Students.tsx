import LayoutFilter from '@components/layout/TeacherFilter/index'
import SappTable from '@components/table/SappTable'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { formatDateFromUTC } from 'src/utils/index'
import StudentCell from '@components/teacher/components/StudentCell'
import { TeacherAPI } from '@pages/api/teacher'
import StudentFilter from '@components/teacher/components/StudentFilter'
import { useForm } from 'react-hook-form'
import { IStudentClassDetail } from 'src/type/classes'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { round } from 'lodash'
import { FOUNDATION } from '@utils/constants'
import useSappPaging from 'src/hooks/useSappPaging'

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

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: 'student',
      queryFn: () =>
        TeacherAPI.getStudentById(
          studentId,
          pagination.current as number,
          pagination.pageSize as number,
          params,
        ),
      params,
    })

  // Hàm tính toán tiến độ học tập của học viên
  const calculateProgress = (record: IStudentClassDetail): number => {
    // Lấy tổng số phần trong khóa học, nếu không có thì gán mặc định là 0
    const totalSections = record?.learning_progress?.total_course_sections ?? 0

    // Lấy số phần đã hoàn thành trong khóa học, nếu không có thì gán mặc định là 0
    const completedSections =
      record?.learning_progress?.total_course_sections_completed ?? 0

    // Nếu tổng số phần lớn hơn 0, tính tiến độ học tập dưới dạng phần trăm
    return totalSections > 0
      ? // Tính tiến độ (completedSections / totalSections) và nhân với 100 để có phần trăm, sau đó làm tròn kết quả đến 2 chữ số thập phân
        round((completedSections / totalSections) * 100, 2)
      : // Nếu không có phần nào trong khóa học (totalSections = 0), trả về tiến độ là 0%
        0
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
