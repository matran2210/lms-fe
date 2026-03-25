'use client'
import { useFeature, UserType } from '@lms/contexts'
import {
  IStudentClassDetail,
  ITabs,
  ProfilePages,
  StatusActionCell,
  StudentKey,
} from '@lms/core'
import { useSappPaging } from '@lms/hooks'
import { LayoutFilter, LayoutTeacher, NameNoActionCell, SappTable } from '@lms/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { withAuthorization } from '@lms/hoc'
import StudentCell from '../../../../components/teacher/StudentCell'
import DateActionCell from '../../../../components/teacher/DateActionCell'
import ChapterTestFilter from '../../../../components/teacher/ChapterTestFilter'

interface FilterParams {
  status?: string
  search?: string
}

const initialValues: FilterParams = {
  search: undefined,
  status: undefined,
}

const ChapterTestPage = () => {
  const { teacherApi, pageLink, query } = useFeature()
  const studentId = query?.studentId as string
  const chapterTestId = query?.chapterTestId as string
  const manualGrading = query?.manualGrading as string
  const [params, setParams] = useState<FilterParams>(initialValues)
  const { control, getValues, reset } = useForm({
    mode: 'onSubmit',
  })

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: StudentKey.ChapterTest,
      queryFn: () =>
        teacherApi!.getDetailTestQuiz(
          studentId,
          chapterTestId,
          pagination.current ?? 1,
          pagination.pageSize ?? 10,
          params,
        ),
      params,
    })

  const breadcrumbs: ITabs[] = [
    { link: pageLink.TEACHERS, title: 'LMS' },
    { link: pageLink.TEACHER_MY_CLASS, title: 'My Class' },
    {
      link: `${pageLink.TEACHER_MY_CLASS}/${studentId}`,
      title: 'Class Detail',
    },
    {
      link: `${pageLink.TEACHER_MY_CLASS}/${studentId}?tabId=${ProfilePages.STUDENTS_TEST_RESULT}`,
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
        <StatusActionCell
          dataColumn={
            record?.attempt?.grading_status || record?.attempt?.status
          }
        />
      ),
    },
    {
      title: 'Final score',
      render: (record: IStudentClassDetail) => (
        <StudentCell dataColumn={record?.attempt?.score?.toString()} />
      ),
    },
    ...(manualGrading === 'true'
      ? [
        {
          title: 'Người chấm',
          render: (record: IStudentClassDetail) => (
            <NameNoActionCell dataColumn={record?.staff?.detail?.full_name} />
          ),
        },
      ]
      : []),
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

export default withAuthorization([UserType.TEACHER])(ChapterTestPage)
