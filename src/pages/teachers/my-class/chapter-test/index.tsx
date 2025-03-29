import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import LayoutFilter from '@components/layout/Filter/index'
import ChapterTestFilter from '@components/teacher/components/ChapterTestFilter'
import { useForm } from 'react-hook-form'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { ITabs } from 'src/type'
import { PageLink } from 'src/constants'
import SappTable from '@components/table/SappTable'
import { TeacherKey } from '@pages/api/queryKey'
import { TablePaginationConfig } from 'antd'
import StudentCell from '@components/teacher/components/StudentCell'
import { formatDateFromUTC } from '@utils/index'
import { IStudentClassDetail } from 'src/type/classes'

interface FilterParams {
  status?: string
  search?: string
}

const initialValues: FilterParams = {
  search: undefined,
  status: undefined,
}

const ChapterTest = () => {
  const router = useRouter()
  const studentId = router?.query?.studentId as string
  const chapterTestId = router?.query?.chapterTestId as string
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })
  const [params, setParams] = useState<FilterParams>(initialValues)

  const { control, getValues, reset } = useForm({
    mode: 'onSubmit',
  })

  const breadcrumbs: ITabs[] = [
    { link: PageLink.TEACHERS, title: 'LMS' },
    { link: PageLink.TEACHER_MY_CLASS, title: 'My Class' },
    {
      link: `${PageLink.TEACHER_MY_CLASS}/${studentId}`,
      title: 'Class Detail',
    },
    {
      link: `${PageLink.TEACHER_MY_CLASS}/${studentId}`,
      title: 'Test/Quiz List',
    },
    { link: '', title: 'Chapter Test' },
  ]
  const { data, isLoading, refetch } = useQuery({
    queryKey: [TeacherKey.ChapterTest, pagination, params],
    queryFn: async () => {
      try {
        return await TeacherAPI.getDetailTestQuiz(
          studentId,
          chapterTestId,
          pagination.current ?? 1,
          pagination.pageSize ?? 10,
          params,
        )
      } catch (error) {
        return null
      }
    },
    retry: false,
  })
  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }
  const handleResetFilter = () => {
    reset({ search: '', status: '' })
    setParams(initialValues)
  }

  const onSubmit = () => {
    const searchParams: FilterParams = {
      status: getValues('status')?.value || undefined,
      search: getValues('search') || undefined,
    }
    setParams(searchParams)
  }

  const columnsValue = [
    {
      title: 'Student ID',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.user?.hubspot_contact_id} />
      ),
    },
    {
      title: 'Name',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.user?.detail?.full_name} />
      ),
    },
    {
      title: 'Email',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          dataColumn={record?.user?.user_contacts?.[0]?.email ?? '-'}
        />
      ),
    },
    {
      title: 'Access Period',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          dataColumn={
            record?.start_time && record?.end_time
              ? `${formatDateFromUTC(record?.start_time)} - ${formatDateFromUTC(
                  record?.end_time,
                )}`
              : '-'
          }
        />
      ),
    },
    {
      title: 'Level',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.user?.detail?.level} />
      ),
    },
    {
      title: 'Duration',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          dataColumn={
            record?.attempt?.finished_at
              ? formatDateFromUTC(record?.attempt?.finished_at)
              : '-'
          }
        />
      ),
    },
    {
      title: 'Progress',
      render: (record: IStudentClassDetail) => (
        <StudentCell
          dataColumn={`${Math.round(
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
        <StudentCell dataColumn={record?.examination_subject} />
      ),
    },
  ]

  return (
    <LayoutTeacher title="My Class" breadcrumbs={breadcrumbs}>
      <LayoutFilter
        listFilter={<ChapterTestFilter control={control} />}
        className="mb-6"
        loading={isLoading}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.data?.class_user_quizzes ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        showCheckbox={false}
      />
    </LayoutTeacher>
  )
}

export default ChapterTest
