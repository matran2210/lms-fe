import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import StudentCell from '@components/teacher/components/StudentCell'
import StudentFilter from '@components/teacher/components/StudentFilter'
import { FOUNDATION, IStudentClassDetail } from '@lms/core'
import { useSappPaging } from '@lms/hooks'
import { LayoutFilter, SappTable } from '@lms/ui'
import { formatDateFromUTC } from '@lms/utils'
import _, { round } from 'lodash'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StudentKey } from 'src/api/queryKey'
import { TeacherAPI } from 'src/api/teacher'

interface FilterParams {
  text?: string
}

const initialValues: FilterParams = {
  text: undefined,
}

export default function Students() {
  const { control, reset, getValues } = useForm()
  const param = useParams()
  const { id } = param
  const studentId = id as string
  const [params, setParams] = useState<FilterParams>(initialValues)

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: StudentKey.Student,
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
      title: 'Student Name',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.user?.detail?.full_name} />
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
            _.isNull(record?.started_at) &&
            _.isNull(record?.finished_at)
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
        isShowIndex
      />
    </>
  )
}
