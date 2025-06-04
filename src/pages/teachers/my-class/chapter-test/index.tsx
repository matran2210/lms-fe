import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LayoutFilter from '@components/layout/TeacherFilter/index'
import ChapterTestFilter from '@components/teacher/components/ChapterTestFilter'
import { useForm } from 'react-hook-form'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { ITabs } from 'src/type'
import { PageLink } from 'src/constants'
import SappTable from '@components/table/SappTable'
import { StudentKey } from '@pages/api/queryKey'
import StudentCell from '@components/teacher/components/StudentCell'
import { IStudentClassDetail } from 'src/type/classes'
import DateActionCell from '@components/teacher/components/DateActionCell'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import StatusActionCell from '@components/teacher/components/StatusActionCell'
import useSappPaging from 'src/hooks/useSappPaging'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ProfilePages } from 'src/type/Profile'

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
  const [params, setParams] = useState<FilterParams>(initialValues)
  const { control, getValues, reset } = useForm({
    mode: 'onSubmit',
  })

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: StudentKey.ChapterTest,
      queryFn: () =>
        TeacherAPI.getDetailTestQuiz(
          studentId,
          chapterTestId,
          pagination.current ?? 1,
          pagination.pageSize ?? 10,
          params,
        ),
      params,
    })

  const breadcrumbs: ITabs[] = [
    { link: PageLink.TEACHERS, title: 'LMS' },
    { link: PageLink.TEACHER_MY_CLASS, title: 'My Class' },
    {
      link: `${PageLink.TEACHER_MY_CLASS}/${studentId}`,
      title: 'Class Detail',
    },
    {
      link: `${PageLink.TEACHER_MY_CLASS}/${studentId}?tabId=${ProfilePages.STUDENTS_TEST_RESULT}`,
      title: 'Test/Quiz List',
    },
    { link: '', title: 'Chapter Test' },
  ]

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
  useEffect(() => {
    if (data?.data?.metadata?.total_records) {
      setPagination((prev) => ({
        ...prev,
        total: data?.metadata?.total_records,
      }))
    }
  }, [data])

  const columnsValue = [
    {
      title: 'Student ID',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell dataColumn={record?.user?.hubspot_contact_id} />
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
        <NameNoActionCell
          dataColumn={record?.user?.user_contacts?.[0]?.email}
        />
      ),
    },
    {
      title: 'Access Period',
      render: (record: IStudentClassDetail) => (
        <DateActionCell
          dataColumn={{
            startTime: record?.start_time as string,
            endTime: record?.end_time as string,
          }}
        />
      ),
    },
    {
      title: 'Submission Time',
      render: (record: IStudentClassDetail) => (
        <DateActionCell
          dataColumn={{
            startTime: record?.attempt?.finished_at as string,
          }}
        />
      ),
    },
    {
      title: 'Status',
      render: (record: IStudentClassDetail) => (
        <StatusActionCell dataColumn={record?.attempt?.status} />
      ),
    },
    {
      title: 'Final score',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.attempt?.score?.toString()} />
      ),
    },
    {
      title: 'Người chấm',
      render: (record: IStudentClassDetail) => (
        <NameNoActionCell dataColumn={record?.staff?.detail?.full_name} />
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
      />
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(ChapterTest)
